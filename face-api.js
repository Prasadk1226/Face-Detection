// const video = document.getElementById("videoElement");
// const canvas = document.getElementById("canvasElement");
// const ctx = canvas.getContext("2d");

// // Set up the camera stream
// async function setupCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
// }

// // Load the necessary face-api models
// async function loadFaceAPI() {
//     await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@latest/models");
//     await faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@latest/models");
//     await faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@latest/models");
//     await faceapi.nets.faceExpressionNet.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@latest/models"); // Add expression model loading
// }

// // Detect faces and their expressions
// async function detectFaces() {
//     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceExpressions();  // Include face expressions

//     // Update canvas size to match the video stream size
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     detections.forEach(detection => {
//         const { x, y, width, height } = detection.detection.box;
//         ctx.strokeStyle = "red";
//         ctx.lineWidth = 2;
//         ctx.strokeRect(x, y, width, height);

//         // Draw landmarks (eyes, mouth, etc.)
//         const landmarks = detection.landmarks;
//         landmarks.positions.forEach(point => {
//             ctx.fillStyle = "yellow";
//             ctx.beginPath();
//             ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
//             ctx.fill();
//         });

//         // Draw face expressions (e.g., happiness, sadness)
//         const expressions = detection.expressions;
//         let maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
//         ctx.fillStyle = "yellow";
//         ctx.font = "30px Arial"; // Increase font size to make text visible
//         ctx.fillText(`Emotion: ${maxExpression} (${Math.round(expressions[maxExpression] * 100)}%)`, x, y - 10);

//         // Debugging: Log the detected expressions for the current face
//         console.log("Expressions detected: ", expressions);
//     });
// }

// // Continuously detect faces every 100ms
// video.addEventListener("play", () => {
//     setInterval(detectFaces, 100); // Update every 100ms to detect faces continuously
// });

// // Initialize the camera and face-api.js models
// setupCamera();
// loadFaceAPI();

// const video = document.getElementById("videoElement");
// const canvas = document.getElementById("canvasElement");
// const ctx = canvas.getContext("2d");

// // Set up the camera stream
// async function setupCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
// }

// // Load the necessary face-api models
// async function loadFaceAPI() {
//     // Load the models
//     await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//     await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
//     await faceapi.nets.faceExpressionNet.loadFromUri("/models");
// }

// // Detect faces and their expressions
// async function detectFaces() {
//     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//         .withFaceLandmarks()
//         .withFaceExpressions();  // Include face expressions

//     // Update canvas size to match the video stream size
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     detections.forEach(detection => {
//         const { x, y, width, height } = detection.detection.box;
//         ctx.strokeStyle = "red";
//         ctx.lineWidth = 2;
//         ctx.strokeRect(x, y, width, height);

//         // Draw landmarks (eyes, mouth, etc.)
//         const landmarks = detection.landmarks;
//         landmarks.positions.forEach(point => {
//             ctx.fillStyle = "yellow";
//             ctx.beginPath();
//             ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
//             ctx.fill();
//         });

//         // Draw face expressions (e.g., happiness, sadness)
//         const expressions = detection.expressions;
//         let maxExpression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
//         ctx.fillStyle = "yellow";
//         ctx.font = "30px Arial"; // Increase font size to make text visible
//         ctx.fillText(`Emotion: ${maxExpression} (${Math.round(expressions[maxExpression] * 100)}%)`, x, y - 10);

//         // Debugging: Log the detected expressions for the current face
//         console.log("Expressions detected: ", expressions);
//     });
// }

// // Start detection once the video plays
// video.addEventListener("play", () => {
//     setInterval(detectFaces, 100); // Update every 100ms to detect faces continuously
// });

// // Initialize the camera and face-api.js models
// setupCamera().then(loadFaceAPI);


// Configuration
const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const DETECTION_INTERVAL = 100; // ms

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');

// Update status message
function updateStatus(message) {
    statusElement.textContent = message;
    console.log(message);
}

// Initialize camera
async function setupCamera() {
    updateStatus('Accessing camera...');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }
        });
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play().then(resolve).catch(() => {
                    console.warn('Auto-play prevented, continuing anyway');
                    resolve();
                });
            };
        });
    } catch (err) {
        updateStatus('Camera error: ' + err.message);
        throw err;
    }
}

// Load required models
async function loadModels() {
    updateStatus('Loading AI models...');
    try {
        // Load only the essential models
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        
        // Optional: Load expression model if needed
        try {
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        } catch (e) {
            console.warn('Could not load expression model, continuing without it');
        }
        
        updateStatus('Models loaded successfully');
    } catch (err) {
        updateStatus('Model loading failed');
        throw err;
    }
}

// Detect and draw faces
async function detectFaces() {
    if (!video.videoWidth || !video.videoHeight) return;

    try {
        // Create detection options
        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,  // Smaller size for better performance
            scoreThreshold: 0.5
        });

        // Perform detection
        let detections;
        if (faceapi.nets.faceExpressionNet.isLoaded) {
            detections = await faceapi.detectAllFaces(video, options)
                .withFaceLandmarks()
                .withFaceExpressions();
        } else {
            detections = await faceapi.detectAllFaces(video, options)
                .withFaceLandmarks();
        }

        // Update canvas dimensions if needed
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw results
        const resizedDetections = faceapi.resizeResults(detections, {
            width: canvas.width,
            height: canvas.height
        });

        // Draw detections
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
        // Draw expressions if available
        if (faceapi.nets.faceExpressionNet.isLoaded && resizedDetections[0]?.expressions) {
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }

    } catch (err) {
        console.error('Detection error:', err);
    }
}

// Main initialization
async function init() {
    try {
        // Step 1: Setup camera
        await setupCamera();
        
        // Step 2: Load models
        await loadModels();
        
        // Step 3: Start detection
        updateStatus('Starting face detection...');
        setInterval(detectFaces, DETECTION_INTERVAL);
        
        // Hide status after 3 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 3000);
        
    } catch (err) {
        statusElement.style.color = '#ff5555';
        console.error('Initialization failed:', err);
    }
}

// Start the application
if (document.readyState === 'complete') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}