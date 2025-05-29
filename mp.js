const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

// Import the API functions
import { maybePredictGesture } from './api-call.js';

// Throttle control for predictions
let lastPredictionTime = 0;
const PREDICTION_INTERVAL = 1000; // 1 second between predictions

// Helper function to trigger arrow key events
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
  
  // Draw the camera feed
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  
  // If hands are detected, draw landmarks and make prediction
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      // Draw hand connections
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5,
      });
      
      // Draw landmarks
      drawLandmarks(canvasCtx, landmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
    }
    
    // Throttle predictions to avoid overwhelming the API
    const now = Date.now();
    if (now - lastPredictionTime >= PREDICTION_INTERVAL) {
      lastPredictionTime = now;
      
      try {
        // Convert the current canvas frame to tensor for prediction
        const imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const tensor = tf.browser.fromPixels(imageData);
        
        // Make prediction using the corrected API
        const direction = await getPredictedLabel(tensor);
        
        if (direction) {
          console.log("Predicted direction:", direction);
          // Trigger the arrow key
          triggerArrowKey("keydown", direction);
          setTimeout(() => {
            triggerArrowKey("keyup", direction);
          }, 100);
        }
        
      } catch (error) {
        console.error("Error processing frame:", error);
      }
    }
  }
  
  canvasCtx.restore();
}

// Initialize MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 1, // Focus on one hand for better performance
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5,
});

hands.onResults(onResults);

// Initialize camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,  // Reduced resolution for better performance
  height: 480,
});

camera.start();

// Helper functions for drawing (you'll need to include MediaPipe drawing utilities)
function drawConnectors(ctx, landmarks, connections, style) {
  // This requires MediaPipe drawing utilities
  // Include: https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js
  if (window.drawConnectors) {
    window.drawConnectors(ctx, landmarks, connections, style);
  }
}

function drawLandmarks(ctx, landmarks, style) {
  // This requires MediaPipe drawing utilities  
  if (window.drawLandmarks) {
    window.drawLandmarks(ctx, landmarks, style);
  }
}