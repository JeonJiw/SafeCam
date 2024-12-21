# SafeCam Project

SafeCam is an intelligent security application designed to provide real-time monitoring of personal belongings in public spaces. Leveraging AI-powered object detection and secure video streaming, SafeCam ensures the safety of your valuables. It particularly focuses on accurate person detection to minimize false alarms and provide users with relevant information.

**Key Values:**

- **Peace of Mind:** Monitor your belongings remotely with real-time video streaming.
- **AI-Powered Security:** Receive alerts triggered by suspicious activity detected through advanced object detection algorithms, especially person detection.
- **Secure Data Management:** User authentication and data encryption ensure the privacy and integrity of your information.

**Key Features:**

- Real-time video streaming from laptop to mobile device.
- AI-powered object detection, with a focus on accurate person detection.
- User authentication and secure data management.
- Push notifications for real-time alerts (planned).

**Project Structure:**
├── backend/ # Backend service using NestJS
├── frontend/ # Frontend built with React.js
└── README.md # Main documentation for the entire project

**Tech Stack:**

- **Frontend:** React.js, WebRTC
- **Backend:** NestJS, TypeORM, PostgreSQL
- **AI:** TensorFlow.js (for general object detection), OpenCV, YOLOv5, SSD, or similar deep learning models (for person detection)
- **Deployment:** Docker, AWS

**Setup Instructions:**

1.  **Backend:**

    - Follow the instructions in the [backend README](./backend/README.md).

2.  **Frontend:**
    - Follow the instructions in the [frontend README](./frontend/README.md).

**Demo:**

- Screenshots / Link (to be added)

**Future Enhancements:**

- Push notifications for real-time alerts (in development).
- Integration of facial recognition for advanced security.
- Cloud storage for video streams.
- Consideration for Intrusion Detection and Prevention System (IDS/IPS).
- Regular security vulnerability scanning.
- Clearly defined video data retention periods, storage limits, and data backup/recovery policies.
- Scalability considerations to handle increasing user loads (using Kubernetes).
- Performance optimization through video compression codec optimization, adjustable streaming resolutions, and CDN usage.

---

**SafeCam Project Overview (Focus on Person Access Detection):**

SafeCam is designed to prevent unauthorized access to laptops when the user is away. It prioritizes accurate person detection to minimize false alarms and provide relevant information. Leveraging cloud-based technologies and sophisticated AI-based person detection algorithms, SafeCam offers real-time monitoring, event-triggered recording, and instant notifications to safeguard valuable data.

**Key Aspects of Person Detection Implementation:**

- Utilizes deep learning models like YOLOv5 or SSD for robust and accurate person detection.
- Employs OpenCV for video preprocessing and other image processing tasks.
- Optimizes models for performance on resource-constrained devices (if necessary) through techniques like model pruning and quantization.

This revised README combines the concise overview with more detailed information about the person detection aspect, making it more informative for both potential users and developers. It also follows standard README conventions for better readability. Remember to replace placeholder information (like the demo link) with actual content when available.
