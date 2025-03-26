// ***********************************************************************************************
// Shadow Art Generator Section
// ***********************************************************************************************

// Get the canvas and context for shadow art generation
const shadowCanvas = document.getElementById("canvas");
const shadowCtx = shadowCanvas.getContext("2d");

shadowCanvas.width = window.innerWidth;
shadowCanvas.height = window.innerHeight;

const undoBtn = document.getElementById("undoBtn");
const deleteBtn = document.getElementById("deleteBtn");

let lightSources = [{ x: shadowCanvas.width / 2, y: shadowCanvas.height / 4 }];
let objects = [
    { x: 300, y: 300, width: 100, height: 100 },
    { x: 500, y: 400, width: 150, height: 80 },
];

let history = [];

shadowCanvas.addEventListener("mousemove", (e) => {
    lightSources[0].x = e.clientX;
    lightSources[0].y = e.clientY;
    drawShadowScene();
});

shadowCanvas.addEventListener("click", (e) => {
    history.push([...objects]);
    objects.push({ x: e.clientX - 50, y: e.clientY - 50, width: 100, height: 100 });
    drawShadowScene();
});

undoBtn.addEventListener("click", () => {
    if (history.length > 0) {
        objects = history.pop();
        drawShadowScene();
    }
});

deleteBtn.addEventListener("click", () => {
    if (objects.length > 0) {
        history.push([...objects]);
        objects.pop();
        drawShadowScene();
    }
});

function drawShadowScene() {
    shadowCtx.clearRect(0, 0, shadowCanvas.width, shadowCanvas.height);
    
    let gradient = shadowCtx.createLinearGradient(0, 0, shadowCanvas.width, shadowCanvas.height);
    gradient.addColorStop(0, "#1e3c72");
    gradient.addColorStop(1, "#2a5298");
    shadowCtx.fillStyle = gradient;
    shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);
    
    lightSources.forEach(light => {
        shadowCtx.fillStyle = "yellow";
        shadowCtx.beginPath();
        shadowCtx.arc(light.x, light.y, 10, 0, Math.PI * 2);
        shadowCtx.fill();
    });
    
    objects.forEach(obj => {
        drawShadow(obj);
        drawObject(obj);
    });
}

function drawShadow(obj) {
    lightSources.forEach(light => {
        let shadowX = obj.x + (obj.x - light.x) * 0.5;
        let shadowY = obj.y + (obj.y - light.y) * 0.5;
        
        let gradient = shadowCtx.createRadialGradient(obj.x, obj.y, 0, shadowX, shadowY, 100);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.5)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        shadowCtx.fillStyle = gradient;
        shadowCtx.beginPath();
        shadowCtx.moveTo(obj.x, obj.y);
        shadowCtx.lineTo(obj.x + obj.width, obj.y);
        shadowCtx.lineTo(shadowX + obj.width, shadowY);
        shadowCtx.lineTo(shadowX, shadowY);
        shadowCtx.closePath();
        shadowCtx.fill();
    });
}

function drawObject(obj) {
    shadowCtx.fillStyle = "white";
    shadowCtx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// Initial scene rendering
drawShadowScene();

// ***********************************************************************************************
// AI Face Detection Section
// ***********************************************************************************************

// Create the video element for face detection
const video = document.createElement("video");
video.autoplay = true;
video.style.position = "absolute";
video.style.top = "50%";
video.style.left = "50%";
video.style.transform = "translate(-50%, -50%)";
document.body.appendChild(video);

// Create the canvas for face detection
const faceCanvas = document.createElement("canvas");
faceCanvas.style.position = "absolute";
faceCanvas.style.top = "50%";
faceCanvas.style.left = "50%";
faceCanvas.style.transform = "translate(-50%, -50%)";
document.body.appendChild(faceCanvas);
const faceCtx = faceCanvas.getContext("2d");

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

async function loadFaceAPI() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/face-api.js@latest/models");
}

async function detectFaces() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    console.log("Faces detected:", detections);
    
    faceCanvas.width = video.videoWidth;
    faceCanvas.height = video.videoHeight;
    faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
    
    detections.forEach(detection => {
        const { x, y, width, height } = detection.box;
        faceCtx.strokeStyle = "red";
        faceCtx.lineWidth = 2;
        faceCtx.strokeRect(x, y, width, height);
    });
}

// Start face detection when video plays
video.addEventListener("play", () => {
    setInterval(detectFaces, 500);
});

setupCamera();
loadFaceAPI();
