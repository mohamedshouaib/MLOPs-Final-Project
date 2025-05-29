import cv2, numpy as np
import mediapipe as mp

_mp_hands = mp.solutions.hands.Hands(
    static_image_mode=True,           
    max_num_hands=1,
    min_detection_confidence=0.5,
)

WRIST = 0      
MID_TIP = 12  

def extract_landmarks(img, *, size: int = 64):

    with mp.solutions.hands.Hands(
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.5,
    ) as hands:

        # MediaPipe expects RGB
        results = hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))

        if not results.multi_hand_landmarks:  
            return None

        # Get first detected hand (21 landmarks)
        lm = np.array([[p.x, p.y, p.z] for p in results.multi_hand_landmarks[0].landmark], dtype=np.float32)

        # Anchor at wrist
        lm -= lm[WRIST]

        # Scale by wrist→mid‑finger‑tip distance (xy‑plane)
        scale = np.linalg.norm(lm[MID_TIP, :2]) + 1e-6
        lm[:, :2] /= scale

        return lm.flatten()
