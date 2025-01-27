import sys
import torch
import numpy as np
from PIL import Image
import cv2
from collections import deque
import json
from datetime import datetime
import warnings
import os

warnings.filterwarnings('ignore')
os.environ['PYTHONWARNINGS'] = 'ignore'

class MotionDetector:
    def __init__(self):
        self.previous_frame = None
        self.motion_threshold = 500  
        self.person_history = deque(maxlen=10)
        self.approach_threshold = 30
        self.last_detection_time = None
        self.detection_cooldown = 3  

    def detect_motion(self, current_frame):
        gray = cv2.cvtColor(np.array(current_frame), cv2.COLOR_RGB2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if self.previous_frame is None:
            self.previous_frame = gray
            return True

        frame_delta = cv2.absdiff(self.previous_frame, gray)
        thresh = cv2.threshold(frame_delta, 20, 255, cv2.THRESH_BINARY)[1]
        motion_detected = np.sum(thresh) > self.motion_threshold
        
        self.previous_frame = gray
        return motion_detected

    def is_approaching(self, person_box):
        area = (person_box[2] - person_box[0]) * (person_box[3] - person_box[1])
        center_x = (person_box[2] + person_box[0]) / 2
        self.person_history.append((area, center_x))

        if len(self.person_history) >= 3:
            area_change = self.person_history[-1][0] - self.person_history[0][0]
            x_change = self.person_history[-1][1] - self.person_history[0][1]
            return area_change > self.approach_threshold or abs(x_change) > 20

        return True

    def should_send_detection(self):
        current_time = datetime.now()
        if self.last_detection_time is None:
            self.last_detection_time = current_time
            return True
        
        time_diff = (current_time - self.last_detection_time).total_seconds()
        if time_diff >= self.detection_cooldown:
            self.last_detection_time = current_time
            return True
        return False

model = torch.hub.load('ultralytics/yolov5', 'yolov5s', verbose=False)
if torch.cuda.is_available():
    model = model.cuda()

model.classes = [0]  # person class only
model.conf = 0.45    # Confidence Threshold

motion_detector = MotionDetector()

def send_message(msg_type, data):
    message = {
        'type': msg_type,
        'timestamp': datetime.now().isoformat(),
        'data': data
    }
    print(json.dumps(message))
    sys.stdout.flush()


send_message('monitoring_start', {
    'status': 'active',
    'message': 'Object detection monitoring started'
})

def detect_objects(image_path):
    try:
        image = Image.open(image_path)
        
        motion_detected = motion_detector.detect_motion(image)
        if not motion_detected:

            motion_detector.reset()
            return

        # YOLO Object Detection
        results = model(image)
        detections = results.pandas().xyxy[0]

        approaching_persons = []
        for _, detection in detections.iterrows():
            if detection['class'] == 0:  # person class
                box = [detection['xmin'], detection['ymin'], 
                      detection['xmax'], detection['ymax']]
                
                if motion_detector.is_approaching(box):
                    detection_dict = {
                        'label': 'person',
                        'confidence': float(detection['confidence']),
                        'bbox': {
                            'xmin': float(detection['xmin']),
                            'ymin': float(detection['ymin']),
                            'xmax': float(detection['xmax']),
                            'ymax': float(detection['ymax'])
                        }
                    }
                    approaching_persons.append(detection_dict)

     
        if approaching_persons and motion_detector.should_send_detection():
            send_message('person_detected', {
                'detections': approaching_persons,
                'alert_level': 'warning'
            })
        elif not approaching_persons:
            motion_detector.reset()
        
    except Exception as e:
        send_message('error', {
            'error': str(e),
            'type': 'detection_error'
        })

while True:
    try:
        image_path = input().strip()
        if image_path:
            detect_objects(image_path)
    except EOFError:
        break
    except Exception as e:
        send_message('error', {
            'error': str(e),
            'type': 'system_error'
        })