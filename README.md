# 🚨 Rescue AR - AI-Powered Emergency Navigation System

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![AR](https://img.shields.io/badge/AR-Powered-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-JS-orange)
![Three.js](https://img.shields.io/badge/Three.js-3D-yellow)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile-lightgrey)

> **Navigate Emergencies Smarter with Augmented Reality**  
> *Real-time AR evacuation guidance • Instant hazard detection • 3D Navigation*

---

## 📱 Live Demo

**Access from anywhere:** https://jahnavichaurasia67-sys.github.io/Rescue-AR/

> ⚠️ Works best on **Chrome browser** with camera & location permissions enabled

---

## 🎯 Problem Statement

| Crisis | Impact |
|--------|--------|
| 😰 Information Access Gap | People struggle to access reliable real-time guidance |
| 🚒 Emergency Services Disconnect | Locating nearest hospitals/fire stations is slow |
| 📱 Fragmented Solutions | Existing tools are app-dependent and unavailable during crises |
| 🔥 Risk Assessment Blind Spot | Smoke, flooding, fire spread cannot be assessed in real time |
| 📍 Communication Breakdown | Victims cannot share location clearly with rescuers |

---

## 💡 Solution

**Rescue AR** is a web-based augmented reality disaster response platform that provides:

- ✅ Instant AI-powered emergency guidance
- ✅ Real-time location-based assistance
- ✅ 3D AR safety navigation with directional arrow
- ✅ AI-powered hazard detection via camera
- ✅ One-tap SOS communication

### No App. No Wait. Just Survival.

---

## ✨ Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| **3D AR Navigation Arrow** | Glowing 3D arrow pointing to nearest emergency shelter | ✅ Live |
| **Real-time Hazard Detection** | AI identifies obstacles (people, fire, smoke, chairs) | ✅ Live |
| **Emergency Services Map** | Shows hospitals, fire stations, police on interactive map | ✅ Live |
| **One-Tap SOS Alert** | Sends GPS location to emergency contacts via SMS | ✅ Live |
| **Distance Color Coding** | 🟢 Green (>100m) 🟠 Orange (<100m) 🔴 Red (<30m) | ✅ Live |
| **Vibration Alerts** | Phone vibrates within 20m of destination | ✅ Live |
| **Floating Particles** | Particles orbit around 3D arrow for visibility | ✅ Live |
| **Compass Integration** | Arrow rotates based on phone orientation | ✅ Live |

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **AR & 3D** | Three.js, WebAR, Device Orientation API |
| **AI/ML** | TensorFlow.js, COCO-SSD Model |
| **Mapping** | Leaflet.js, OpenStreetMap, Overpass API |
| **Location** | Geolocation API, Haversine Algorithm |
| **Deployment** | Git, GitHub, GitHub Pages |

---

## 🏗️ System Architecture
┌─────────────────────────────────────────────────────────────────┐
│ RESCUE AR SYSTEM │
├─────────────────────────────────────────────────────────────────┤
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Frontend │ │ 3D Engine │ │ AI Engine │ │
│ │ HTML/CSS/JS │ │ Three.js │ │ TensorFlow │ │
│ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Location │ │ Compass │ │ Camera │ │
│ │ GPS API │ │ Orientation │ │ Feed │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ External APIs & Services │ │
│ │ OpenStreetMap │ Overpass API │ Emergency Database │ │
│ └──────────────────────────────────────────────────────────┘ │
│ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Deployment: GitHub Pages │ │
│ └──────────────────────────────────────────────────────────┘ │
│ │
└─────────────────────────────────────────────────────────────────┘

text

---

## 🔄 User Flow
Splash Screen (Start Emergency Mode)
│
▼
Permission Requests (Location + Camera)
│
▼
MAP VIEW
┌─────────────────┐
│ • User location │
│ • Hospitals │
│ • Fire Stations │
│ • Police │
└────────┬────────┘
│
┌────────┴────────┐
│ │
▼ ▼
AR MODE SOS PANEL
│ │
▼ ▼
3D Arrow Send Location
Points to via SMS
Safety

text

---

## 🎮 3D AR Arrow Features

### Color Coding by Distance

| Distance | Color | Action |
|----------|-------|--------|
| > 100 meters | 🟢 Green | Continue following |
| 30 - 100 meters | 🟠 Orange | Getting close |
| < 30 meters | 🔴 Red + Vibration | Almost there! |

### Visual Effects

| Effect | Description |
|--------|-------------|
| Pulsing Scale | Arrow grows/shrinks by 5% |
| Floating Particles | 20 particles orbit the arrow |
| Glow Effect | Emissive intensity based on distance |
| Smooth Rotation | Follows compass heading |

---

## 🤖 AI Hazard Detection

Uses **TensorFlow.js** with **COCO-SSD** model:

| Object Detected | Action |
|----------------|--------|
| 👤 Person | Red bounding box + warning |
| 🪑 Chair/Obstacle | Navigate around |
| 🔥 Fire | Evacuation guidance |
| 🚪 Door | Direction update |

---

## 📂 Project Structure
Rescue-AR/
├── index.html # Complete application (HTML + CSS + JS)
├── README.md # Documentation
└── .nojekyll # GitHub Pages config

text

**Single file design** - Everything in one HTML file for easy deployment.

---

## 🚀 Installation

### For Users (No Setup)
1. Open Chrome on phone
2. Visit: https://jahnavichaurasia67-sys.github.io/Rescue-AR/
3. Click "Start Emergency Mode"
4. Allow permissions
5. Follow the 3D arrow

### For Developers
```bash
git clone https://github.com/jahnavichaurasia67-sys/Rescue-AR.git
cd Rescue-AR
python -m http.server 8000
# Open http://localhost:8000
📱 Device Compatibility
Browser	Platform	Status
Chrome	Android 10+	✅ Fully Supported
Chrome	iOS 15+	⚠️ Partial
Safari	iOS 15+	⚠️ Partial
Firefox	Android	✅ Supported
Chrome	Desktop	⚠️ Limited (no camera)
📞 Emergency Numbers
Service	Number
Police	100
Ambulance	102
Fire	101
Women Helpline	1090
National Emergency	112
🗺️ Roadmap
text
Q4 2024           Q1 2025           Q2 2025
    │                 │                 │
    ▼                 ▼                 ▼
Production      Emergency        Regulatory
Ready           Integration      Compliance
    │                 │                 │
    ▼                 ▼                 ▼
✅ Real API     🔲 Twilio SMS    🔲 Govt Approval
✅ Offline      🔲 Dashboard     🔲 Data Privacy
✅ Battery      🔲 WebSocket     🔲 Security
👥 Team
Role	Name	Institution
Team Lead	Jahnavi Chaurasia	FGIET, Rae Bareli
Team Member	Sakina Kazmi	FGIET, Rae Bareli
HackHer Duo - Created with ❤️ for disaster safety

🙏 Acknowledgments
OpenStreetMap for emergency service data

TensorFlow Team for COCO-SSD model

Three.js Community for 3D graphics

Leaflet.js for mapping

GitHub for free hosting

⚠️ Disclaimer
IMPORTANT: Rescue AR is a DEMO PROTOTYPE.

SOS feature opens messaging app - does NOT auto-call emergency services

In real emergency, please call 112 directly

GPS accuracy varies by device

Test in safe environments only

📄 License
✅ Educational and personal use permitted

✅ Forking and modification allowed

❌ Commercial use requires permission

🤝 Contributing
Areas needing help:

Backend API for emergency alerts

Offline mode completion

Voice guidance

Multi-language support

📞 Contact
Live Demo: https://jahnavichaurasia67-sys.github.io/Rescue-AR/

GitHub: https://github.com/jahnavichaurasia67-sys/Rescue-AR

⭐ Star This Repository
If you find Rescue AR useful, please star the repository!

"Because survival should never depend on guesswork."

Rescue AR - Navigate Emergencies Smarter 🚨

<div align="center"> Made with ❤️ by HackHer Duo <br> <sub>© 2024 Rescue AR Project</sub> </div> ```