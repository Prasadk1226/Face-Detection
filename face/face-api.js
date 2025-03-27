// // Configuration
// const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
// const DETECTION_INTERVAL = 100; // ms

// // DOM Elements
// const video = document.getElementById('video');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const statusElement = document.getElementById('status');

// // Update status message
// function updateStatus(message) {
//     statusElement.textContent = message;
//     console.log(message);
// }

// // Initialize camera
// async function setupCamera() {
//     updateStatus('Accessing camera...');
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             video: {
//                 width: { ideal: 1280 },
//                 height: { ideal: 720 },
//                 facingMode: 'user'
//             }
//         });
//         video.srcObject = stream;
        
//         return new Promise((resolve) => {
//             video.onloadedmetadata = () => {
//                 video.play().then(resolve).catch(() => {
//                     console.warn('Auto-play prevented, continuing anyway');
//                     resolve();
//                 });
//             };
//         });
//     } catch (err) {
//         updateStatus('Camera error: ' + err.message);
//         throw err;
//     }
// }

// // Load required models
// async function loadModels() {
//     updateStatus('Loading AI models...');
//     try {
//         // Load only the essential models
//         await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        
//         // Optional: Load expression model if needed
//         try {
//             await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
//         } catch (e) {
//             console.warn('Could not load expression model, continuing without it');
//         }
        
//         updateStatus('Models loaded successfully');
//     } catch (err) {
//         updateStatus('Model loading failed');
//         throw err;
//     }
// }

// // Detect and draw faces
// async function detectFaces() {
//     if (!video.videoWidth || !video.videoHeight) return;

//     try {
//         // Create detection options
//         const options = new faceapi.TinyFaceDetectorOptions({
//             inputSize: 320,  // Smaller size for better performance
//             scoreThreshold: 0.5
//         });

//         // Perform detection
//         let detections;
//         if (faceapi.nets.faceExpressionNet.isLoaded) {
//             detections = await faceapi.detectAllFaces(video, options)
//                 .withFaceLandmarks()
//                 .withFaceExpressions();
//         } else {
//             detections = await faceapi.detectAllFaces(video, options)
//                 .withFaceLandmarks();
//         }

//         // Update canvas dimensions if needed
//         if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//         }

//         // Clear previous frame
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Draw results
//         const resizedDetections = faceapi.resizeResults(detections, {
//             width: canvas.width,
//             height: canvas.height
//         });

//         // Draw detections
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
//         // Draw expressions if available
//         if (faceapi.nets.faceExpressionNet.isLoaded && resizedDetections[0]?.expressions) {
//             faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//         }

//     } catch (err) {
//         console.error('Detection error:', err);
//     }
// }

// // Main initialization
// async function init() {
//     try {
//         // Step 1: Setup camera
//         await setupCamera();
        
//         // Step 2: Load models
//         await loadModels();
        
//         // Step 3: Start detection
//         updateStatus('Starting face detection...');
//         setInterval(detectFaces, DETECTION_INTERVAL);
        
//         // Hide status after 3 seconds
//         setTimeout(() => {
//             statusElement.style.display = 'none';
//         }, 3000);
        
//     } catch (err) {
//         statusElement.style.color = '#ff5555';
//         console.error('Initialization failed:', err);
//     }
// }

// // Start the application
// if (document.readyState === 'complete') {
//     init();
// } else {
//     document.addEventListener('DOMContentLoaded', init);
// }


// // Configuration
// const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
// // Alternative CDN URL (if GitHub is slow):
// // const MODEL_URL = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/weights';
// const DETECTION_INTERVAL = 100; // ms
// const PRECISION_MODE = 'high'; // 'high' or 'balanced'

// // DOM Elements
// const video = document.getElementById('video');
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const statusElement = document.getElementById('status');
// const actionElement = document.createElement('div');
// actionElement.id = 'actions';
// document.body.appendChild(actionElement);

// // State tracking
// let lastActionTime = 0;
// const actionCooldown = 3000; // ms
// let facePresenceHistory = [];
// const presenceThreshold = 5; // frames
// let currentMood = 'neutral';
// let moodHistory = [];
// let blinkCount = 0;
// let lastBlinkTime = 0;
// let yawnCount = 0;

// // Update status message
// function updateStatus(message) {
//     statusElement.textContent = message;
//     console.log(message);
// }

// // Initialize camera with higher resolution
// async function setupCamera() {
//     updateStatus('Accessing HD camera...');
//     try {
//         const constraints = {
//             video: {
//                 width: { ideal: 1280 },
//                 height: { ideal: 720 },
//                 frameRate: { ideal: 30 },
//                 facingMode: 'user'
//             }
//         };
        
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         video.srcObject = stream;
        
//         return new Promise((resolve) => {
//             video.onloadedmetadata = () => {
//                 video.play().then(resolve).catch(() => {
//                     console.warn('Auto-play prevented, continuing anyway');
//                     resolve();
//                 });
//             };
//         });
//     } catch (err) {
//         updateStatus('Camera error: ' + err.message);
//         throw err;
//     }
// }

// // Load available models
// async function loadModels() {
//     updateStatus('Loading AI models...');
//     try {
//         // Load detection models
//         if (PRECISION_MODE === 'high') {
//             await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
//         } else {
//             await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//         }
        
//         // Load additional models
//         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//         await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
//         await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
//         updateStatus('Models loaded successfully');
//     } catch (err) {
//         updateStatus('Model loading failed: ' + err.message);
//         throw err;
//     }
// }

// // Calculate EAR (Eye Aspect Ratio) for blink detection
// function getEAR(eyeLandmarks) {
//     // Vertical distances
//     const A = faceapi.euclideanDistance(eyeLandmarks[1], eyeLandmarks[5]);
//     const B = faceapi.euclideanDistance(eyeLandmarks[2], eyeLandmarks[4]);
    
//     // Horizontal distance
//     const C = faceapi.euclideanDistance(eyeLandmarks[0], eyeLandmarks[3]);
    
//     return (A + B) / (2 * C);
// }

// // Detect yawn based on mouth aspect ratio
// function detectYawn(mouthLandmarks) {
//     const mouthHeight = faceapi.euclideanDistance(mouthLandmarks[13], mouthLandmarks[19]);
//     const mouthWidth = faceapi.euclideanDistance(mouthLandmarks[0], mouthLandmarks[6]);
//     const ratio = mouthHeight / mouthWidth;
    
//     return ratio > 0.6; // Threshold for yawn detection
// }

// // Analyze mood based on expression history
// function analyzeMood(expressions) {
//     moodHistory.push(expressions);
//     if (moodHistory.length > 10) moodHistory.shift();
    
//     // Calculate average expressions
//     const avgExpressions = moodHistory.reduce((acc, curr) => {
//         Object.keys(curr).forEach(key => {
//             acc[key] = (acc[key] || 0) + curr[key];
//         });
//         return acc;
//     }, {});
    
//     Object.keys(avgExpressions).forEach(key => {
//         avgExpressions[key] /= moodHistory.length;
//     });
    
//     // Determine dominant expression
//     let maxScore = 0;
//     let dominantExpression = 'neutral';
    
//     Object.entries(avgExpressions).forEach(([expression, score]) => {
//         if (score > maxScore) {
//             maxScore = score;
//             dominantExpression = expression;
//         }
//     });
    
//     return dominantExpression;
// }

// // Perform human-like actions based on detection
// function performActions(detections) {
//     const now = Date.now();
//     const timeSinceLastAction = now - lastActionTime;
    
//     if (detections.length === 0) {
//         facePresenceHistory.push(false);
//         if (facePresenceHistory.filter(v => !v).length >= presenceThreshold) {
//             if (timeSinceLastAction > actionCooldown) {
//                 actionElement.textContent = "Are you there? I can't see you.";
//                 lastActionTime = now;
//             }
//         }
//         return;
//     }
    
//     facePresenceHistory.push(true);
//     if (facePresenceHistory.length > presenceThreshold) {
//         facePresenceHistory.shift();
//     }
    
//     const landmarks = detections[0].landmarks;
//     const expressions = detections[0].expressions;
    
//     // Blink detection
//     const leftEyeEAR = getEAR(landmarks.getLeftEye());
//     const rightEyeEAR = getEAR(landmarks.getRightEye());
//     const avgEAR = (leftEyeEAR + rightEyeEAR) / 2;
    
//     if (avgEAR < 0.2) { // Blink threshold
//         if (now - lastBlinkTime > 300) { // Debounce blinks
//             blinkCount++;
//             lastBlinkTime = now;
            
//             if (blinkCount === 3 && timeSinceLastAction > actionCooldown) {
//                 actionElement.textContent = "You seem tired with all that blinking. Need a break?";
//                 lastActionTime = now;
//                 blinkCount = 0;
//             }
//         }
//     }
    
//     // Yawn detection
//     if (detectYawn(landmarks.getMouth())) {
//         yawnCount++;
        
//         if (yawnCount === 2 && timeSinceLastAction > actionCooldown) {
//             actionElement.textContent = "That's a big yawn! Maybe time for a coffee?";
//             lastActionTime = now;
//             yawnCount = 0;
//         }
//     }
    
//     // Mood detection and response
//     const mood = analyzeMood(expressions);
//     if (mood !== currentMood && timeSinceLastAction > actionCooldown) {
//         currentMood = mood;
        
//         const moodResponses = {
//             'happy': "You're looking cheerful today! 😊",
//             'sad': "You seem a bit down. Everything okay?",
//             'angry': "Whoa, you look upset. Take a deep breath.",
//             'surprised': "Did I surprise you? 😮",
//             'disgusted': "Something bothering you?",
//             'fearful': "You look concerned. What's wrong?",
//             'neutral': "Thinking deep thoughts?"
//         };
        
//         if (moodResponses[mood]) {
//             actionElement.textContent = moodResponses[mood];
//             lastActionTime = now;
//         }
//     }
    
//     // Head tilt detection
//     const nose = landmarks.getNose();
//     const leftEye = landmarks.getLeftEye()[0];
//     const rightEye = landmarks.getRightEye()[3];
//     const eyeMidpoint = {
//         x: (leftEye.x + rightEye.x) / 2,
//         y: (leftEye.y + rightEye.y) / 2
//     };
    
//     const tiltAngle = Math.atan2(nose[6].y - eyeMidpoint.y, nose[6].x - eyeMidpoint.x) * 180 / Math.PI;
    
//     if (Math.abs(tiltAngle) > 15 && timeSinceLastAction > actionCooldown) {
//         actionElement.textContent = tiltAngle > 0 ? 
//             "Interesting head tilt to the left. What are you thinking?" : 
//             "Interesting head tilt to the right. What's on your mind?";
//         lastActionTime = now;
//     }
// }

// // Enhanced face detection
// async function detectFaces() {
//     if (!video.videoWidth || !video.videoHeight) return;

//     try {
//         // Create detection options
//         const options = PRECISION_MODE === 'high' ? 
//             new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }) :
//             new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 });

//         // Perform detection
//         const detections = await faceapi.detectAllFaces(video, options)
//             .withFaceLandmarks()
//             .withFaceExpressions();

//         // Update canvas dimensions
//         faceapi.matchDimensions(canvas, video);

//         // Clear previous frame
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         // Draw results
//         const resizedDetections = faceapi.resizeResults(detections, {
//             width: video.videoWidth,
//             height: video.videoHeight
//         });

//         // Draw detections and landmarks
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        
//         // Draw expressions if available
//         if (resizedDetections[0]?.expressions) {
//             faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            
//             // Display most likely expression
//             const expressions = resizedDetections[0].expressions;
//             const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
//             const [emotion, confidence] = sorted[0];
            
//             ctx.font = '24px Arial';
//             ctx.fillStyle = '#00FF00';
//             ctx.fillText(
//                 `${emotion} (${Math.round(confidence * 100)}%)`, 
//                 20, 
//                 50
//             );
//         }
        
//         // Perform human-like actions
//         if (resizedDetections.length > 0) {
//             performActions(resizedDetections);
//         }

//     } catch (err) {
//         console.error('Detection error:', err);
//     }
// }

// // Main initialization
// async function init() {
//     try {
//         // Step 1: Setup camera
//         await setupCamera();
        
//         // Step 2: Load models
//         await loadModels();
        
//         // Step 3: Start detection
//         updateStatus('Starting face detection...');
//         setInterval(detectFaces, DETECTION_INTERVAL);
        
//         // Hide status after 3 seconds
//         setTimeout(() => {
//             statusElement.style.display = 'none';
//         }, 3000);
        
//     } catch (err) {
//         statusElement.style.color = '#ff5555';
//         updateStatus('Initialization failed: ' + err.message);
//         console.error('Initialization failed:', err);
//     }
// }

// // Start the application
// if (document.readyState === 'complete') {
//     init();
// } else {
//     document.addEventListener('DOMContentLoaded', init);
// }



// Configuration
const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const DETECTION_INTERVAL = 100; // ms
const PRECISION_MODE = 'balanced'; // 'high' or 'balanced'

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusElement = document.getElementById('status');
const actionElement = document.getElementById('actions');

// State tracking
let lastActionTime = 0;
const actionCooldown = 3000; // ms
let facePresenceHistory = [];
const presenceThreshold = 5; // frames
let currentMood = 'neutral';
let moodHistory = [];
let blinkCount = 0;
let lastBlinkTime = 0;
let yawnCount = 0;
let detectionInterval = null;

// Update status message
function updateStatus(message) {
    statusElement.textContent = message;
    console.log(message);
}

// Initialize camera
async function setupCamera() {
    updateStatus('Accessing camera...');
    try {
        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
                facingMode: 'user'
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.width = video.videoWidth;
                video.height = video.videoHeight;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
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

// Load models
async function loadModels() {
    updateStatus('Loading AI models...');
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        updateStatus('Models loaded successfully');
        return true;
    } catch (err) {
        updateStatus('Model loading failed: ' + err.message);
        console.error('Model loading error:', err);
        return false;
    }
}

// Eye Aspect Ratio calculation
function getEAR(eyeLandmarks) {
    const A = faceapi.euclideanDistance(eyeLandmarks[1], eyeLandmarks[5]);
    const B = faceapi.euclideanDistance(eyeLandmarks[2], eyeLandmarks[4]);
    const C = faceapi.euclideanDistance(eyeLandmarks[0], eyeLandmarks[3]);
    return (A + B) / (2 * C);
}

// Yawn detection
function detectYawn(mouthLandmarks) {
    const mouthHeight = faceapi.euclideanDistance(mouthLandmarks[13], mouthLandmarks[19]);
    const mouthWidth = faceapi.euclideanDistance(mouthLandmarks[0], mouthLandmarks[6]);
    return mouthHeight / mouthWidth > 0.6;
}

// Mood analysis
function analyzeMood(expressions) {
    moodHistory.push(expressions);
    if (moodHistory.length > 10) moodHistory.shift();
    
    const avgExpressions = moodHistory.reduce((acc, curr) => {
        Object.keys(curr).forEach(key => acc[key] = (acc[key] || 0) + curr[key]);
        return acc;
    }, {});
    
    Object.keys(avgExpressions).forEach(key => avgExpressions[key] /= moodHistory.length);
    
    return Object.entries(avgExpressions).reduce((max, [exp, score]) => 
        score > max.score ? {expression: exp, score} : max, 
        {expression: 'neutral', score: 0}
    ).expression;
}

// Face detection
async function detectFaces() {
    if (!video.videoWidth || !video.videoHeight) return null;

    try {
        const options = PRECISION_MODE === 'high' ? 
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }) :
            new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 });

        const detections = await faceapi.detectAllFaces(video, options)
            .withFaceLandmarks()
            .withFaceExpressions();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.matchDimensions(canvas, video);

        if (detections.length > 0) {
            const resizedDetections = faceapi.resizeResults(detections, {
                width: video.videoWidth,
                height: video.videoHeight
            });

            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            
            return resizedDetections;
        }
        return null;
    } catch (err) {
        console.error('Detection error:', err);
        return null;
    }
}

// Enhanced Action Handling with Improved Head Tilt Detection
// Enhanced Action Handling with Improved Head Tilt Detection
function performActions(detections) {
    if (!detections || detections.length === 0) {
        actionElement.textContent = '';
        return;
    }
    
    const now = Date.now();
    const timeSinceLastAction = now - lastActionTime;
    const landmarks = detections[0].landmarks;
    const expressions = detections[0].expressions;
    const detection = detections[0].detection;

    // Blink detection
    const leftEAR = getEAR(landmarks.getLeftEye());
    const rightEAR = getEAR(landmarks.getRightEye());
    const avgEAR = (leftEAR + rightEAR) / 2;
    
    if (avgEAR < 0.2 && now - lastBlinkTime > 300) {
        blinkCount++;
        lastBlinkTime = now;
        if (blinkCount >= 3 && timeSinceLastAction > actionCooldown) {
            actionElement.textContent = "You seem tired with all that blinking. Need a break?";
            lastActionTime = now;
            blinkCount = 0;
            return;
        }
    }
    
    // Yawn detection
    if (detectYawn(landmarks.getMouth())) {
        yawnCount++;
        if (yawnCount >= 2 && timeSinceLastAction > actionCooldown) {
            actionElement.textContent = "That's a big yawn! Maybe time for a coffee?";
            lastActionTime = now;
            yawnCount = 0;
            return;
        }
    }
    
    // Mood detection
    const mood = analyzeMood(expressions);
    if (mood !== currentMood && timeSinceLastAction > actionCooldown) {
        currentMood = mood;
        const moodResponses = {
            'happy': "You're looking cheerful today! 😊",
            'sad': "You seem a bit down. Everything okay?",
            'angry': "Whoa, you look upset. Take a deep breath.",
            'surprised': "Did I surprise you? 😮",
            'disgusted': "Something bothering you?",
            'fearful': "You look concerned. What's wrong?",
            'neutral': "Thinking deep thoughts?"
        };
        actionElement.textContent = moodResponses[mood] || '';
        lastActionTime = now;
        return;
    }
    
    // Enhanced Head Tilt Detection - UPDATED SECTION
    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye()[0];
    const rightEye = landmarks.getRightEye()[3];
    
    // Calculate eye midpoint
    const eyeMidpoint = {
        x: (leftEye.x + rightEye.x) / 2,
        y: (leftEye.y + rightEye.y) / 2
    };
    
    // Calculate vertical line (straight up from eye midpoint)
    const verticalLineEnd = {
        x: eyeMidpoint.x,
        y: eyeMidpoint.y - 50 // Arbitrary length for vertical line
    };
    
    // Calculate angle between vertical line and nose-to-eye line
    const verticalAngle = Math.atan2(verticalLineEnd.y - eyeMidpoint.y, verticalLineEnd.x - eyeMidpoint.x);
    const noseAngle = Math.atan2(nose[6].y - eyeMidpoint.y, nose[6].x - eyeMidpoint.x);
    let tiltAngle = (noseAngle - verticalAngle) * 180 / Math.PI;
    
    // Normalize angle to -90 to 90 range
    if (tiltAngle > 90) tiltAngle -= 180;
    if (tiltAngle < -90) tiltAngle += 180;
    
    // Determine tilt direction with corrected calculation
    let tiltDirection;
    if (tiltAngle > 15) {
        tiltDirection = "right";
    } else if (tiltAngle < -15) {
        tiltDirection = "left";
    } else {
        tiltDirection = "straight";
    }
    
    // Additional conditions for better accuracy
    const isSignificantTilt = Math.abs(tiltAngle) > 15; // Minimum 15 degree tilt
    const isHighConfidence = detection.score > 0.85;
    const isFaceCentered = Math.abs(eyeMidpoint.x - canvas.width/2) < canvas.width/4;
    const isFaceLargeEnough = detection.box.width > canvas.width/5;
    
    if (isSignificantTilt && isHighConfidence && isFaceCentered && isFaceLargeEnough && timeSinceLastAction > actionCooldown) {
        if (tiltDirection !== "straight") {
actionElement.textContent = `Head tilt to the ${tiltDirection} (${Math.abs(tiltAngle).toFixed(1)}°)`;
            lastActionTime = now;
            
            // Visual tilt indicator
            ctx.beginPath();
            ctx.moveTo(eyeMidpoint.x, eyeMidpoint.y);
            ctx.lineTo(nose[6].x, nose[6].y);
            ctx.strokeStyle = '#00FF00';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

// Main initialization
async function init() {
    try {
        if (typeof faceapi === 'undefined') {
            throw new Error('FaceAPI library not loaded');
        }

        await setupCamera();
        const modelsLoaded = await loadModels();
        if (!modelsLoaded) throw new Error('Could not load models');
        
        updateStatus('Starting detection...');
        
        if (detectionInterval) clearInterval(detectionInterval);
        detectionInterval = setInterval(async () => {
            const detections = await detectFaces();
            if (detections && detections.length > 0) {
                performActions(detections);
                facePresenceHistory.push(true);
            } else {
                actionElement.textContent = '';
                facePresenceHistory.push(false);
            }
            
            if (facePresenceHistory.length > presenceThreshold) {
                facePresenceHistory.shift();
                
                // Check if user has been away
                const facesMissing = facePresenceHistory.filter(v => !v).length >= presenceThreshold;
                if (facesMissing && Date.now() - lastActionTime > actionCooldown) {
                    actionElement.textContent = "Are you there? I can't see you.";
                    lastActionTime = Date.now();
                }
            }
        }, DETECTION_INTERVAL);
        
        setTimeout(() => statusElement.style.display = 'none', 3000);
        
    } catch (err) {
        statusElement.style.color = '#ff5555';
        updateStatus('Error: ' + err.message);
        actionElement.innerHTML = `Try refreshing the page or checking your camera permissions`;
        console.error('Initialization failed:', err);
    }
}

// Start application
document.addEventListener('DOMContentLoaded', init);