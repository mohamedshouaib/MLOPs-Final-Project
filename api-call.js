import * as tf from "@tensorflow/tfjs";

const API_URL = "http://localhost:8000/predict/predict";

const GESTURE_TO_DIRECTION = {
  "thumbs_up": "up",
  "thumbs_down": "down",
  "peace": "left",
  "stop": "right"
};

let lastPredictionTime = 0;
const PREDICTION_INTERVAL = 1000; 

/**
 * Called on new frame — throttles predictions
 * @param {tf.Tensor3D} processed_t - RGB image tensor
 */
export async function maybePredictGesture(processed_t) {
  const now = Date.now();
  if (now - lastPredictionTime < PREDICTION_INTERVAL) {
    tf.dispose(processed_t);
    return;
  }

  lastPredictionTime = now;
  const direction = await getPredictedLabel(processed_t);
  if (direction) {
    console.log("🧭 Move:", direction);
  }
}

/**
 * Sends image tensor to FastAPI and returns mapped direction
 * @param {tf.Tensor3D} processed_t
 * @returns {"up" | "down" | "left" | "right" | null}
 */
export async function getPredictedLabel(processed_t) {
  try {
    const [height, width] = processed_t.shape;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    await tf.browser.toPixels(processed_t, canvas);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob ? resolve(blob) : reject(new Error("Blob creation failed"));
      }, "image/jpeg", 0.8);
    });

    const formData = new FormData();
    formData.append("file", blob, "gesture_frame.jpg");

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn(" API Error:", response.status, await response.text());
      return null;
    }

    const result = await response.json();
    console.log(" Prediction result:", result);

    const rawGesture = result.class;
    const direction = GESTURE_TO_DIRECTION[rawGesture?.toLowerCase()];

    if (direction) {
      console.log(" Gesture → direction:", rawGesture, "→", direction);
      return direction;
    } else {
      console.warn("Unknown gesture:", rawGesture);
      return null;
    }

  } catch (error) {
    console.error("Error in getPredictedLabel:", error);
    return null;
  } finally {
    tf.dispose(processed_t);
  }
}
