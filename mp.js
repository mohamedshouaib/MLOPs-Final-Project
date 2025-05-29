const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

import { getPredictedLabel } from './api-call.js';

function triggerArrowKey(eventType, direction) {
  const keyMap = {
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'left': 'ArrowLeft',
    'right': 'ArrowRight'
  };

  const event = new KeyboardEvent(eventType, {
    key: keyMap[direction],
    code: keyMap[direction],
    bubbles: true
  });

  document.dispatchEvent(event);
}

async function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      drawLandmarks(canvasCtx, landmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
    }

    try {
      const imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const tensor = tf.browser.fromPixels(imageData);

      const direction = await getPredictedLabel(tensor);
      if (direction) {
        console.log("Predicted direction:", direction);
        triggerArrowKey("keydown", direction);
        setTimeout(() => triggerArrowKey("keyup", direction), 100);
      }

    } catch (err) {
      console.error("Prediction error:", err);
    }
  }

  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5,
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();

function drawConnectors(ctx, landmarks, connections, style) {
  if (window.drawConnectors) {
    window.drawConnectors(ctx, landmarks, connections, style);
  }
}

function drawLandmarks(ctx, landmarks, style) {
  if (window.drawLandmarks) {
    window.drawLandmarks(ctx, landmarks, style);
  }
}
