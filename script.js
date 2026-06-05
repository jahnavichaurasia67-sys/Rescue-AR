// ===== APP STATE =====
let currentMode = 'splash';
let userLocation = null;
let watchId = null;
let map = null;
let userMarker = null;
let arActive = false;
let cameraStream = null;
let deviceOrientation = 0;
let objectDetectionModel = null;
let detectionInterval = null;
let emergencyServicesMarkers = [];

// ===== DOM ELEMENTS =====
const splash = document.getElementById('splash');
const mainContainer = document.getElementById('mainContainer');
const arView = document.getElementById('arView');
const mapView = document.getElementById('mapView');
const startBtn = document.getElementById('startBtn');
const toggleARBtn = document.getElementById('toggleARBtn');
const exitAR = document.getElementById('exitAR');
const sosBtns = document.querySelectorAll('#mapSOSBtn, #arSOSBtn');
const sosPanel = document.getElementById('sosPanel');
const closeSOS = document.getElementById('closeSOS');
const sendSOS = document.getElementById('sendSOS');
const callEmergency = document.getElementById('callEmergency');
const shareLocation = document.getElementById('shareLocation');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    startBtn.addEventListener('click', initEmergencyMode);
    if (toggleARBtn) toggleARBtn.addEventListener('click', startARMode);
    if (exitAR) exitAR.addEventListener('click', stopARMode);
    sosBtns.forEach(btn => btn?.addEventListener('click', showSOSPanel));
    closeSOS?.addEventListener('click', () => sosPanel.classList.add('hidden'));
    sendSOS?.addEventListener('click', sendEmergencyAlert);
    callEmergency?.addEventListener('click', () => window.location.href = 'tel:911');
    shareLocation?.addEventListener('click', shareCurrentLocation);
    
    // Load TensorFlow model in background
    loadTensorFlowModel();
});

// ===== MAIN INIT =====
async function initEmergencyMode() {
    showToast('Starting Rescue AR...', 2000);
    
    const permissionsGranted = await requestPermissions();
    
    if (permissionsGranted) {
        splash.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        startLocationTracking();
        initMap();
        currentMode = 'map';
        mapView.classList.remove('hidden');
        showToast('✅ Ready! AR navigation active', 2000);
    } else {
        showToast('❌ Permissions required for Rescue AR', 3000);
    }
}

// ===== PERMISSIONS =====
async function requestPermissions() {
    try {
        // Request geolocation
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000
            });
        });
        
        // Request camera (just for permission, not streaming yet)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        
        return true;
    } catch (error) {
        console.error('Permission error:', error);
        alert('Rescue AR needs camera and location access to work. Please enable them in settings.');
        return false;
    }
}

// ===== LOCATION TRACKING =====
function startLocationTracking() {
    if (!navigator.geolocation) {
        showToast('Geolocation not supported', 3000);
        return;
    }
    
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                heading: position.coords.heading || 0
            };
            
            updateUIWithLocation();
            findNearbyEmergencyServices();
            
            if (arActive) {
                updateARDirection();
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            document.getElementById('gpsStatus').innerHTML = '⚠️ GPS weak';
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
}

function updateUIWithLocation() {
    if (!userLocation) return;
    
    // Update status bar
    const gpsStatus = document.getElementById('gpsStatus');
    if (gpsStatus) {
        const accuracyText = userLocation.accuracy < 20 ? '📍 High accuracy' : 
                            userLocation.accuracy < 50 ? '📍 Medium accuracy' : '⚠️ Low accuracy';
        gpsStatus.innerHTML = gpsStatus.innerHTML = `📍 ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
    }
    
    // Update map
    if (map && userMarker) {
        userMarker.setLatLng([userLocation.lat, userLocation.lng]);
        map.setView([userLocation.lat, userLocation.lng], 18);
    }
}

// ===== MAP INITIALIZATION =====
function initMap() {
    const defaultCenter = [28.6139, 77.2090];
    
    map = L.map('map').setView(defaultCenter, 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Custom user marker
    userMarker = L.marker(defaultCenter, {
        icon: L.divIcon({ 
            html: '🧑‍🦯',
            className: 'user-marker',
            iconSize: [30, 30]
        })
    }).addTo(map);
    
    if (userLocation) {
        userMarker.setLatLng([userLocation.lat, userLocation.lng]);
        map.setView([userLocation.lat, userLocation.lng], 18);
    }
}

// ===== FIND EMERGENCY SERVICES =====
async function findNearbyEmergencyServices() {
    if (!userLocation) return;
    
    const radius = 2000; // 2km radius
    const query = `
        [out:json];
        (
            node["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});
            node["amenity"="fire_station"](around:${radius},${userLocation.lat},${userLocation.lng});
            node["amenity"="police"](around:${radius},${userLocation.lat},${userLocation.lng});
            node["emergency"="yes"](around:${radius},${userLocation.lat},${userLocation.lng});
        );
        out body;
    `;
    
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(overpassUrl);
        const data = await response.json();
        
        // Clear old markers
        emergencyServicesMarkers.forEach(marker => map.removeLayer(marker));
        emergencyServicesMarkers = [];
        
        let hospitals = 0, fireStations = 0, police = 0;
        
        data.elements.forEach(element => {
            const type = element.tags.amenity || element.tags.emergency;
            let icon = '📍';
            let category = '';
            
            if (type === 'hospital') {
                icon = '🏥';
                category = 'Hospital';
                hospitals++;
            } else if (type === 'fire_station') {
                icon = '🚒';
                category = 'Fire Station';
                fireStations++;
            } else if (type === 'police') {
                icon = '👮';
                category = 'Police';
                police++;
            } else if (type === 'yes') {
                icon = '🚨';
                category = 'Emergency Point';
            }
            
            const marker = L.marker([element.lat, element.lon], {
                icon: L.divIcon({ 
                    html: icon,
                    className: 'emergency-marker',
                    iconSize: [25, 25]
                })
            }).addTo(map);
            
            marker.bindPopup(`<b>${category}</b><br>📍 ${element.tags.name || 'Emergency Service'}`);
            emergencyServicesMarkers.push(marker);
        });
        
        // Update status bar
        const emergencyCount = document.getElementById('emergencyCount');
        if (emergencyCount) {
            emergencyCount.innerHTML = `🏥${hospitals} 🚒${fireStations} 👮${police}`;
        }
        
    } catch (error) {
        console.error('Overpass API error:', error);
        const emergencyCount = document.getElementById('emergencyCount');
        if (emergencyCount) emergencyCount.innerHTML = '⚠️ Services offline';
    }
}

// ===== AR MODE =====
async function startARMode() {
    mapView.classList.add('hidden');
    arView.classList.remove('hidden');
    arActive = true;
    
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        const videoElement = document.getElementById('cameraFeed');
        videoElement.srcObject = cameraStream;
        await videoElement.play();
        
        // Start orientation tracking
        window.addEventListener('deviceorientation', handleOrientation);
        
        // Start object detection if model loaded
        if (objectDetectionModel) {
            startObjectDetection();
        }
        
        showToast('AR Mode Active - Follow the arrow!', 2000);
        updateARDirection();
        
    } catch (error) {
        console.error('Camera error:', error);
        showToast('Cannot access camera', 2000);
        stopARMode();
    }
}

function stopARMode() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    window.removeEventListener('deviceorientation', handleOrientation);
    
    if (detectionInterval) {
        clearInterval(detectionInterval);
        detectionInterval = null;
    }
    
    arActive = false;
    arView.classList.add('hidden');
    mapView.classList.remove('hidden');
}

function handleOrientation(event) {
    deviceOrientation = event.alpha || 0;
}

function updateARDirection() {
    if (!arActive || !userLocation) return;
    
    // Find nearest emergency service
    let nearest = null;
    let minDistance = Infinity;
    
    emergencyServicesMarkers.forEach(marker => {
        const latLng = marker.getLatLng();
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            latLng.lat, latLng.lng
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            nearest = latLng;
        }
    });
    
    if (nearest) {
        const bearing = calculateBearing(
            userLocation.lat, userLocation.lng,
            nearest.lat, nearest.lng
        );
        
        const relativeBearing = (bearing - deviceOrientation + 360) % 360;
        const arrow = document.getElementById('directionArrow');
        const distanceInfo = document.getElementById('distanceInfo');
        
        if (arrow && distanceInfo) {
            // Determine arrow direction based on bearing difference
            if (relativeBearing < 20 || relativeBearing > 340) {
                arrow.innerHTML = '⬆️';
                arrow.style.color = '#2ecc71';
            } else if (relativeBearing < 160) {
                arrow.innerHTML = '↗️';
                arrow.style.color = '#f39c12';
            } else if (relativeBearing < 200) {
                arrow.innerHTML = '⬇️';
                arrow.style.color = '#e74c3c';
            } else if (relativeBearing < 340) {
                arrow.innerHTML = '↖️';
                arrow.style.color = '#f39c12';
            }
            
            if (minDistance < 50) {
                distanceInfo.innerHTML = `📍 ${Math.round(minDistance)}m - VERY CLOSE!`;
                arrow.style.animation = 'pulse 0.5s infinite';
            } else if (minDistance < 200) {
                distanceInfo.innerHTML = `📍 ${Math.round(minDistance)}m ahead`;
                arrow.style.animation = 'bounce 1s infinite';
            } else {
                distanceInfo.innerHTML = `📍 ${Math.round(minDistance)}m - Follow arrow`;
            }
        }
    }
    
    requestAnimationFrame(updateARDirection);
}

// ===== TENSORFLOW OBJECT DETECTION =====
async function loadTensorFlowModel() {
    try {
        showToast('Loading AI hazard detection...', 2000);
        objectDetectionModel = await cocoSsd.load();
        console.log('TensorFlow model loaded');
        showToast('✅ AI hazard detection ready', 1500);
    } catch (error) {
        console.error('Model load error:', error);
    }
}

function startObjectDetection() {
    const video = document.getElementById('cameraFeed');
    const canvas = document.getElementById('arCanvas');
    const ctx = canvas.getContext('2d');
    
    detectionInterval = setInterval(async () => {
        if (!objectDetectionModel || !video.videoWidth) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const predictions = await objectDetectionModel.detect(video);
        
        // Hazardous objects to detect
        const hazardClasses = ['person', 'fire', 'chair', 'bottle', 'book', 'tv'];
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let hazardDetected = false;
        
        predictions.forEach(prediction => {
            if (hazardClasses.includes(prediction.class) && prediction.score > 0.6) {
                hazardDetected = true;
                
                // Draw bounding box
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 3;
                ctx.strokeRect(
                    prediction.bbox[0], prediction.bbox[1],
                    prediction.bbox[2], prediction.bbox[3]
                );
                
                // Draw label
                ctx.fillStyle = '#e74c3c';
                ctx.font = '16px Arial';
                ctx.fillText(
                    `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                    prediction.bbox[0], prediction.bbox[1] - 5
                );
            }
        });
        
        // Update hazard indicator
        const hazardIndicator = document.getElementById('hazardIndicator');
        const hazardText = document.getElementById('hazardText');
        
        if (hazardDetected) {
            hazardIndicator.classList.remove('hidden');
            hazardText.innerHTML = '⚠️ Obstacle Detected! ⚠️';
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                if (hazardIndicator) hazardIndicator.classList.add('hidden');
            }, 3000);
        }
        
    }, 500);
}

// ===== UTILITY FUNCTIONS =====
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    let θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360;
}

// ===== SOS FUNCTIONS =====
function showSOSPanel() {
    if (userLocation) {
        const locationText = `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`;
        document.getElementById('locationStatus').innerHTML = `
            📍 Current Location:<br>
            <strong>${locationText}</strong><br>
            🎯 Accuracy: ±${Math.round(userLocation.accuracy)}m
        `;
        
        // Update accuracy meter
        const accuracyPercent = Math.max(0, Math.min(100, 
            100 - (userLocation.accuracy / 100) * 100
        ));
        document.querySelector('.accuracy-fill').style.width = `${accuracyPercent}%`;
    }
    sosPanel.classList.remove('hidden');
}

async function sendEmergencyAlert() {
    if (!userLocation) {
        showToast('Cannot get location', 2000);
        return;
    }
    
    const emergencyData = {
        timestamp: new Date().toISOString(),
        location: userLocation,
        userAgent: navigator.userAgent,
        type: 'EMERGENCY_SOS'
    };
    
    console.log('🚨 SOS ALERT:', emergencyData);
    
    // Try to send SMS via intent (mobile only)
    const smsBody = encodeURIComponent(
        `🚨 RESCUE AR EMERGENCY 🚨\n\n` +
        `I need immediate assistance!\n` +
        `📍 Location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}\n` +
        `🎯 Accuracy: ±${Math.round(userLocation.accuracy)}m\n` +
        `⏰ Time: ${new Date().toLocaleString()}\n\n` +
        `This is an automated emergency alert from Rescue AR.`
    );
    
    // For mobile - open SMS app
    window.location.href = `sms:911?body=${smsBody}`;
    
    showToast('SOS Sent! Opening SMS...', 3000);
    
    setTimeout(() => {
        sosPanel.classList.add('hidden');
    }, 2000);
}

async function shareCurrentLocation() {
    if (!userLocation) {
        showToast('Getting location...', 2000);
        return;
    }
    
    const shareData = {
        title: 'Rescue AR - My Location',
        text: `I need assistance! My current location:`,
        url: `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showToast('Location shared!', 1500);
        } else {
            // Fallback - copy to clipboard
            const locationUrl = `https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
            await navigator.clipboard.writeText(locationUrl);
            showToast('Location copied to clipboard!', 1500);
        }
    } catch (error) {
        console.error('Share failed:', error);
    }
}

function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.innerHTML = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
    }
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
});