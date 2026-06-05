// App State
let currentMode = 'splash'; // splash, ar, map
let userLocation = null;
let hazards = [];
let safeExits = [];
let watchId = null;

// DOM Elements
const splash = document.getElementById('splash');
const arView = document.getElementById('arView');
const mapView = document.getElementById('mapView');
const startBtn = document.getElementById('startBtn');
const toggleAR = document.getElementById('toggleAR');
const sosBtn = document.getElementById('sosBtn');
const sosPanel = document.getElementById('sosPanel');
const closeSOS = document.getElementById('closeSOS');
const sendSOS = document.getElementById('sendSOS');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    startBtn.addEventListener('click', initEmergencyMode);
    toggleAR?.addEventListener('click', toggleARMode);
    sosBtn?.addEventListener('click', showSOSPanel);
    closeSOS?.addEventListener('click', () => sosPanel.classList.add('hidden'));
    sendSOS?.addEventListener('click', sendEmergencyAlert);
});

async function initEmergencyMode() {
    splash.classList.add('hidden');
    
    // Request permissions
    const permissionsGranted = await requestPermissions();
    
    if (permissionsGranted) {
        startLocationTracking();
        startMapView();
        currentMode = 'map';
        mapView.classList.remove('hidden');
    } else {
        alert('Permissions required for Rescue AR to work');
        splash.classList.remove('hidden');
    }
}

async function requestPermissions() {
    try {
        // Geolocation permission
        const locationPermission = await navigator.permissions.query({ name: 'geolocation' });
        
        // Camera permission (for AR mode)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        
        return true;
    } catch (error) {
        console.error('Permission denied:', error);
        return false;
    }
}

function startLocationTracking() {
    if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                updateMapWithUserLocation();
                findNearbyEmergencyServices();
            },
            (error) => console.error('Geolocation error:', error),
            { enableHighAccuracy: true, maximumAge: 5000 }
        );
    }
}

// Map Integration
let map = null;
let userMarker = null;

function startMapView() {
    if (!map) {
        map = L.map('map').setView([28.6139, 77.2090], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
}

function updateMapWithUserLocation() {
    if (!userLocation || !map) return;
    
    if (!userMarker) {
        userMarker = L.marker([userLocation.lat, userLocation.lng], {
            icon: L.divIcon({ html: '🧑‍🦯', className: 'user-marker' })
        }).addTo(map);
    } else {
        userMarker.setLatLng([userLocation.lat, userLocation.lng]);
    }
    
    map.setView([userLocation.lat, userLocation.lng], 18);
}

// Haversine Distance Calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
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

// Bearing Calculation (for AR direction arrows)
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

// Find nearby emergency services using Overpass API
async function findNearbyEmergencyServices() {
    if (!userLocation) return;
    
    const radius = 1000; // 1km radius
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="hospital"](around:${radius},${userLocation.lat},${userLocation.lng});node["amenity"="fire_station"](around:${radius},${userLocation.lat},${userLocation.lng});node["amenity"="police"](around:${radius},${userLocation.lat},${userLocation.lng}););out;`;
    
    try {
        const response = await fetch(overpassUrl);
        const data = await response.json();
        
        // Clear existing markers (except user)
        map.eachLayer((layer) => {
            if (layer.options && layer.options.pane === 'markerPane' && layer !== userMarker) {
                map.removeLayer(layer);
            }
        });
        
        // Add emergency markers
        data.elements.forEach(element => {
            const icon = getEmergencyIcon(element.tags.amenity);
            L.marker([element.lat, element.lon], {
                icon: L.divIcon({ html: icon, className: 'emergency-marker' })
            }).addTo(map);
        });
        
    } catch (error) {
        console.error('Overpass API error:', error);
    }
}

function getEmergencyIcon(type) {
    const icons = {
        hospital: '🏥',
        fire_station: '🚒',
        police: '👮'
    };
    return icons[type] || '📍';
}

// AR Mode Implementation
let arActive = false;
let cameraStream = null;
let deviceOrientation = 0;

async function startARMode() {
    arView.classList.remove('hidden');
    mapView.classList.add('hidden');
    
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        const videoElement = document.getElementById('cameraFeed');
        videoElement.srcObject = cameraStream;
        
        // Start orientation tracking
        window.addEventListener('deviceorientation', handleOrientation);
        
        arActive = true;
        startARDirectionGuide();
        
    } catch (error) {
        console.error('Camera error:', error);
        alert('Cannot access camera for AR mode');
        toggleMapMode();
    }
}

function handleOrientation(event) {
    deviceOrientation = event.alpha || 0;
}

function startARDirectionGuide() {
    // Find nearest safe exit or emergency service
    const nearestExit = findNearestSafePoint();
    
    if (nearestExit && userLocation) {
        const bearing = calculateBearing(
            userLocation.lat, userLocation.lng,
            nearestExit.lat, nearestExit.lon
        );
        
        const relativeBearing = (bearing - deviceOrientation + 360) % 360;
        updateDirectionArrow(relativeBearing);
        
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            nearestExit.lat, nearestExit.lon
        );
        updateDistanceInfo(distance);
    }
}

function findNearestSafePoint() {
    // For demo - return a sample safe point
    // In production, this would query OpenStreetMap for exits/safe zones
    if (!userLocation) return null;
    
    return {
        lat: userLocation.lat + 0.001,
        lon: userLocation.lng + 0.001,
        name: 'Emergency Exit'
    };
}

function updateDirectionArrow(bearing) {
    const arrow = document.getElementById('directionArrow');
    if (!arrow) return;
    
    // Show arrow only when pointing roughly at destination
    if (Math.abs(bearing) < 30 || Math.abs(bearing - 360) < 30) {
        arrow.style.display = 'block';
        arrow.style.transform = `rotate(${bearing}deg)`;
    } else {
        arrow.style.display = 'none';
        // Show "turn" indicator
        if (bearing < 180) {
            arrow.innerHTML = '↪️';
        } else {
            arrow.innerHTML = '↩️';
        }
        arrow.style.display = 'block';
    }
}

function updateDistanceInfo(distance) {
    const distanceInfo = document.getElementById('distanceInfo');
    if (distanceInfo) {
        if (distance < 10) {
            distanceInfo.innerHTML = '📍 You have arrived';
        } else if (distance < 50) {
            distanceInfo.innerHTML = `📏 ${Math.round(distance)}m - Almost there!`;
        } else {
            distanceInfo.innerHTML = `📏 ${Math.round(distance)}m ahead`;
        }
    }
}

function toggleARMode() {
    if (arActive) {
        toggleMapMode();
    } else {
        startARMode();
    }
}

function toggleMapMode() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    window.removeEventListener('deviceorientation', handleOrientation);
    
    arView.classList.add('hidden');
    mapView.classList.remove('hidden');
    arActive = false;
}

// SOS Functionality
function showSOSPanel() {
    if (userLocation) {
        document.getElementById('locationStatus').innerHTML = 
            `📍 Location: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}<br>
             📱 Accuracy: ±${Math.round(userLocation.accuracy)}m`;
    }
    sosPanel.classList.remove('hidden');
}

async function sendEmergencyAlert() {
    if (!userLocation) {
        alert('Cannot get your location. Please enable GPS.');
        return;
    }
    
    const emergencyData = {
        timestamp: new Date().toISOString(),
        location: userLocation,
        device: navigator.userAgent,
        status: 'EMERGENCY - Immediate assistance required'
    };
    
    // In production: Send to emergency API, SMS, or WebSocket
    console.log('SOS ALERT:', emergencyData);
    
    // Simulate SMS (would need backend service)
    const smsUrl = `sms://+911234567890?body=EMERGENCY: I need help at ${userLocation.lat},${userLocation.lng}`;
    
    // For demo - show alert
    alert(`🚨 SOS SENT!\n\nLocation: ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}\n\nEmergency services have been notified. Stay safe and follow AR guidance.`);
    
    sosPanel.classList.add('hidden');
}

// Hazard detection simulation (expand with TensorFlow.js)
function simulateHazardDetection() {
    setInterval(() => {
        if (arActive && Math.random() < 0.1) {
            const hazardDiv = document.getElementById('hazardIndicator');
            if (hazardDiv) {
                hazardDiv.classList.remove('hidden');
                hazardDiv.innerHTML = '⚠️ Smoke Detected Ahead! ⚠️';
                setTimeout(() => hazardDiv.classList.add('hidden'), 3000);
            }
        }
    }, 5000);
}

// Service Worker for Offline Support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service Worker registered:', reg);
    });
}

// Initialize hazard simulation
simulateHazardDetection();