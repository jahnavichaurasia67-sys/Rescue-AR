# 🚨 Rescue AR - AI-Powered Emergency Navigation System

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![AR](https://img.shields.io/badge/AR-Powered-green)
![TensorFlow](https://img.shields.io/badge/TensorFlow-JS-orange)
![Three.js](https://img.shields.io/badge/Three.js-3D-yellow)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile-lightgrey)

> **Navigate Emergencies Smarter with Augmented Reality**
> Real-time AR evacuation guidance • Instant hazard detection • 3D Navigation

---

# 📱 Live Demo

**Access from anywhere:**
https://jahnavichaurasia67-sys.github.io/Rescue-AR/

⚠️ Works best on **Google Chrome** with Camera and Location permissions enabled.

---

# 🎯 Problem Statement

During disasters and emergency situations, people often struggle to find safe evacuation routes, nearby emergency services, and reliable real-time guidance. Existing solutions are fragmented, app-dependent, and frequently fail when immediate assistance is required.

| Crisis                           | Impact                                                           |
| -------------------------------- | ---------------------------------------------------------------- |
| 😰 Information Access Gap        | People struggle to access reliable real-time guidance            |
| 🚒 Emergency Services Disconnect | Locating nearest hospitals and fire stations takes valuable time |
| 📱 Fragmented Solutions          | Most solutions require dedicated mobile applications             |
| 🔥 Risk Assessment Blind Spot    | Hazards cannot be identified quickly                             |
| 📍 Communication Breakdown       | Victims cannot easily share precise locations                    |

---

# 💡 Solution

**Rescue AR** is a web-based Augmented Reality disaster response platform that provides:

* ✅ Instant AI-powered emergency guidance
* ✅ Real-time location-based assistance
* ✅ 3D AR navigation with directional arrow
* ✅ AI hazard detection using device camera
* ✅ One-tap SOS communication
* ✅ Emergency service discovery

### No App. No Wait. Just Survival.

---

# ✨ Key Features

| Feature                    | Description                                         | Status |
| -------------------------- | --------------------------------------------------- | ------ |
| 3D AR Navigation Arrow     | Points toward nearest emergency shelter/service     | ✅ Live |
| Real-Time Hazard Detection | Detects people, obstacles, fire, and objects        | ✅ Live |
| Emergency Services Map     | Shows hospitals, fire stations, and police stations | ✅ Live |
| One-Tap SOS Alert          | Opens SMS with GPS location                         | ✅ Live |
| Distance Color Coding      | Green, Orange, and Red proximity indicators         | ✅ Live |
| Vibration Alerts           | Vibrates when approaching destination               | ✅ Live |
| Floating Particles         | Improves AR arrow visibility                        | ✅ Live |
| Compass Integration        | Arrow follows phone orientation                     | ✅ Live |

---

# 🛠️ Technology Stack

| Category          | Technologies                            |
| ----------------- | --------------------------------------- |
| Frontend          | HTML5, CSS3, JavaScript (ES6+)          |
| AR & 3D           | Three.js, WebAR, Device Orientation API |
| AI/ML             | TensorFlow.js, COCO-SSD                 |
| Mapping           | Leaflet.js, OpenStreetMap, Overpass API |
| Location Services | Geolocation API, Haversine Algorithm    |
| Deployment        | GitHub Pages                            |

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────┐
│                RESCUE AR SYSTEM               │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│                 FRONTEND UI                   │
│             HTML • CSS • JavaScript           │
└───────────────────────────────────────────────┘
          │              │              │
          ▼              ▼              ▼
 ┌────────────┐  ┌────────────┐  ┌────────────┐
 │ GPS Module │  │ 3D Engine  │  │ AI Engine  │
 │ Location   │  │ Three.js   │  │TensorFlow  │
 └────────────┘  └────────────┘  └────────────┘
          │              │              │
          └──────────────┼──────────────┘
                         ▼
          ┌────────────────────────────┐
          │ Device Sensors & Camera    │
          │ GPS • Compass • Camera     │
          └────────────────────────────┘
                         │
                         ▼
          ┌────────────────────────────┐
          │ External Services          │
          │ OpenStreetMap              │
          │ Overpass API               │
          └────────────────────────────┘
                         │
                         ▼
          ┌────────────────────────────┐
          │ GitHub Pages Deployment    │
          └────────────────────────────┘
```

---

# 🔄 User Flow

```text
START EMERGENCY MODE
          │
          ▼
PERMISSION REQUESTS
(Camera + Location)
          │
          ▼
      MAP VIEW
 ┌─────────────────┐
 │ User Location   │
 │ Hospitals       │
 │ Fire Stations   │
 │ Police Stations │
 └─────────────────┘
          │
 ┌────────┴────────┐
 ▼                 ▼
AR MODE         SOS PANEL
 │                 │
 ▼                 ▼
3D AR Arrow     Send GPS
Guidance        Location
 │
 ▼
Reach Safety
```

---

# 🎮 3D AR Navigation

## Distance-Based Color Coding

| Distance   | Color     | Action                  |
| ---------- | --------- | ----------------------- |
| > 100 m    | 🟢 Green  | Continue Following      |
| 30 - 100 m | 🟠 Orange | Approaching Destination |
| < 30 m     | 🔴 Red    | Arrived / Very Close    |

## Visual Effects

| Effect             | Description               |
| ------------------ | ------------------------- |
| Pulsing Animation  | Arrow scales continuously |
| Floating Particles | Orbit around arrow        |
| Glow Effect        | Enhanced visibility       |
| Smooth Rotation    | Compass-based movement    |

---

# 🤖 AI Hazard Detection

Powered by **TensorFlow.js** and **COCO-SSD**.

| Object      | Response              |
| ----------- | --------------------- |
| 👤 Person   | Detection & Warning   |
| 🪑 Obstacle | Avoidance Guidance    |
| 🔥 Fire     | Emergency Alert       |
| 🚪 Door     | Navigation Assistance |

---

# 📂 Project Structure

```text
Rescue-AR/
│
├── index.html
├── README.md
└── .nojekyll
```

**Single-file architecture** for simple deployment and maintenance.

---

# 🚀 Installation

## For Users

1. Open Chrome Browser
2. Visit the live demo
3. Click "Start Emergency Mode"
4. Allow Camera Permission
5. Allow Location Permission
6. Follow the AR Arrow

## For Developers

```bash
git clone https://github.com/jahnavichaurasia67-sys/Rescue-AR.git

cd Rescue-AR

python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

# 📱 Device Compatibility

| Browser | Platform    | Status              |
| ------- | ----------- | ------------------- |
| Chrome  | Android 10+ | ✅ Fully Supported   |
| Firefox | Android     | ✅ Supported         |
| Safari  | iOS 15+     | ⚠️ Partial Support  |
| Chrome  | Desktop     | ⚠️ Limited Features |

---

# 📞 Emergency Numbers (India)

| Service            | Number |
| ------------------ | ------ |
| Police             | 100    |
| Ambulance          | 102    |
| Fire Brigade       | 101    |
| Women Helpline     | 1090   |
| National Emergency | 112    |

---

# 🗺️ Roadmap

```text
PHASE 1
✅ AR Navigation
✅ AI Hazard Detection
✅ Emergency Mapping
✅ GitHub Deployment

PHASE 2
🔲 Twilio SMS Integration
🔲 Live Dashboard
🔲 WebSocket Updates
🔲 Voice Navigation

PHASE 3
🔲 Government Integration
🔲 Regulatory Compliance
🔲 Security Enhancements
🔲 Data Privacy Framework
```

---

# 👥 Team

| Role        | Name              | Institution       |
| ----------- | ----------------- | ----------------- |
| Team Lead   | Jahnavi Chaurasia | FGIET, Rae Bareli |
| Team Member | Sakina Kazmi      | FGIET, Rae Bareli |

### HackHer Duo ❤️

Built for emergency response and disaster safety.

---

# 🏆 Hackathon

**CYPHERSNOVA INNOVATOR'S HACKATHON 2026**

Project Submission: **Rescue AR - AI-Powered Emergency Navigation System**

---

# 🙏 Acknowledgments

* OpenStreetMap
* Overpass API
* TensorFlow.js Team
* Three.js Community
* Leaflet.js
* GitHub Pages

---

# ⚠️ Disclaimer

**Rescue AR is a prototype demonstration project.**

* SOS opens the SMS application and does not automatically contact emergency services.
* In actual emergencies, dial **112** immediately.
* GPS accuracy varies across devices.
* Test only in safe environments.

---

# 📄 License

✅ Educational Use Allowed

✅ Personal Use Allowed

✅ Modification Allowed

❌ Commercial Use Requires Permission

---

# 🤝 Contributing

Contributions are welcome in:

* Backend API Integration
* Offline Mode
* Voice Assistance
* Multi-Language Support
* Emergency Analytics

---

# 📞 Contact

### Live Demo

https://jahnavichaurasia67-sys.github.io/Rescue-AR/

### GitHub Repository

https://github.com/jahnavichaurasia67-sys/Rescue-AR

---

# ⭐ Support

If you find this project useful, please consider starring the repository.

> "Because survival should never depend on guesswork."

---

# 🚨 Rescue AR

### Navigate Emergencies Smarter

Made with ❤️ by **HackHer Duo**

© 2026 Rescue AR Project
