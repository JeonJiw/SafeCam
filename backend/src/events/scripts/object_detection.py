import sys
import torch
import numpy as np
from PIL import Image
import cv2
from collections import deque

class MotionDetector:
    def __init__(self):
        self.previous_frame = None
        self.motion_threshold = 500  # 움직임 감지 임계값
        self.person_history = deque(maxlen=10)  # 이전 위치 기록
        self.approach_threshold = 30  # 접근 판단 임계값

    def detect_motion(self, current_frame):
        # 그레이스케일 변환
        gray = cv2.cvtColor(np.array(current_frame), cv2.COLOR_RGB2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        if self.previous_frame is None:
            self.previous_frame = gray
            return True

        # 프레임 차이 계산
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
            # 면적 변화와 중심점 이동을 모두 고려
            area_change = self.person_history[-1][0] - self.person_history[0][0]
            x_change = self.person_history[-1][1] - self.person_history[0][1]
            
            # 면적이 증가하거나 중심점이 크게 변하면 움직임으로 판단
            return area_change > self.approach_threshold or abs(x_change) > 20

        return True  # 초기에는 모든 감지 허용

model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
if torch.cuda.is_available():
    model = model.cuda()

# 사람 클래스만 감지하도록 설정
model.classes = [0]  # person class only
model.conf = 0.45    # 신뢰도 임계값

motion_detector = MotionDetector()

def detect_objects(image_path):
    try:
        image = Image.open(image_path)
        
        # 움직임 감지
        motion_detected = motion_detector.detect_motion(image)
        if not motion_detected:
            print("No motion detected")
            return

        # YOLO 객체 감지
        results = model(image)
        detections = results.pandas().xyxy[0]

        # 접근하는 사람 필터링
        approaching_persons = []
        for _, detection in detections.iterrows():
            if detection['class'] == 0:  # person class
                box = [detection['xmin'], detection['ymin'], 
                      detection['xmax'], detection['ymax']]
                
                if motion_detector.is_approaching(box):
                    approaching_persons.append(detection.to_dict())

        if approaching_persons:
            print(f"Detection results: {approaching_persons}")
        
        sys.stdout.flush()
        
    except Exception as e:
        print(f"Error in detect_objects: {str(e)}", file=sys.stderr)
        sys.stderr.flush()

while True:
    try:
        image_path = input().strip()
        if image_path:
            detect_objects(image_path)
    except EOFError:
        break
    except Exception as e:
        print(f"Error in main loop: {str(e)}", file=sys.stderr)
        sys.stderr.flush()