// Add to app.js
async function initObjectDetection() {
    const model = await cocoSsd.load();
    const video = document.getElementById('cameraFeed');
    
    detectFrame(model, video);
}

async function detectFrame(model, video) {
    const predictions = await model.detect(video);
    
    predictions.forEach(prediction => {
        if (hazardObjects.includes(prediction.class)) {
            highlightHazard(prediction.bbox);
        }
    });
    
    requestAnimationFrame(() => detectFrame(model, video));
}

const hazardObjects = ['fire', 'smoke', 'person', 'chair', 'obstacle'];