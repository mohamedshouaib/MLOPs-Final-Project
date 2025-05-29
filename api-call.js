import * as tf from "@tensorflow/tfjs";

// ✅ Replace with your actual FastAPI backend URL
const API_URL = "http://localhost:8000/predict/predict";

// ✅ Gesture class → maze direction map
const GESTURE_TO_DIRECTION = {
  "one": "up",
  "fist": "down", 
  "two": "left",
  "three": "right"
};

// ⏱️ Throttle control
let lastPredictionTime = 0;
const PREDICTION_INTERVAL = 1000; // milliseconds

/**
 * 🔁 Called each time a frame is ready — safely throttles calls
 * @param {tf.Tensor3D} processed_t - A [H,W,3] image tensor
 */
export async function maybePredictGesture(processed_t) {
  const now = Date.now();
  if (now - lastPredictionTime < PREDICTION_INTERVAL) {
    tf.dispose(processed_t);
    return; // ⏳ Skip if too soon
  }

  lastPredictionTime = now;
  const direction = await getPredictedLabel(processed_t);
  if (direction) {
    console.log("🧭 Move:", direction);
    // 👉 Optional: Trigger maze movement here
  }
}

/**
 * 🧠 Sends image tensor to FastAPI, gets predicted class, and maps to direction
 * @param {tf.Tensor3D} processed_t - RGB image [H,W,3]
 * @returns {"up" | "down" | "left" | "right" | null}
 */
export async function getPredictedLabel(processed_t) {
  try {
    // ✅ Get tensor dimensions
    const [height, width] = processed_t.shape;
    
    // Create a canvas to convert tensor to image
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    // Convert tensor to pixels on canvas
    await tf.browser.toPixels(processed_t, canvas);

    // 📸 Convert canvas → JPEG blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      }, "image/jpeg", 0.8);
    });

    // 📤 Build FormData payload
    const formData = new FormData();
    formData.append("file", blob, "gesture_frame.jpg");

    // 🚀 Send to FastAPI with proper error handling
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary for FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("⚠️ API Error:", response.status, errorText);
      return null;
    }

    const result = await response.json();
    console.log("🎯 Backend prediction:", result);

    // Extract the predicted class
    const rawGesture = result.class;
    if (!rawGesture) {
      console.warn("⚠️ No class in response:", result);
      return null;
    }

    // Map gesture to direction
    const direction = GESTURE_TO_DIRECTION[rawGesture.toLowerCase()];
    if (direction) {
      console.log("✅ Mapped gesture to direction:", rawGesture, "→", direction);
      return direction;
    } else {
      console.log("ℹ️ Unknown gesture:", rawGesture);
      return null;
    }

  } catch (error) {
    console.error("❌ getPredictedLabel() error:", error);
    return null;
  } finally {
    // ✅ Always clean up tensor
    tf.dispose(processed_t);
  }
}

/**
 * 🎯 Alternative function that takes ImageData directly
 * @param {ImageData} imageData - Raw image data from canvas
 * @returns {"up" | "down" | "left" | "right" | null}
 */
export async function getPredictedLabelFromImageData(imageData) {
  try {
    // Create canvas from ImageData
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(imageData, 0, 0);

    // Convert to blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob from ImageData"));
        }
      }, "image/jpeg", 0.8);
    });

    // Send to API
    const formData = new FormData();
    formData.append("file", blob, "gesture_frame.jpg");

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn("⚠️ API Error:", response.status, await response.text());
      return null;
    }

    const result = await response.json();
    const direction = GESTURE_TO_DIRECTION[result.class?.toLowerCase()];
    
    if (direction) {
      console.log("✅ Gesture direction:", direction);
    }
    
    return direction || null;

  } catch (error) {
    console.error("❌ getPredictedLabelFromImageData() error:", error);
    return null;
  }
}