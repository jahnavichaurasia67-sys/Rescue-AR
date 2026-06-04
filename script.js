let userLat = null;
let userLon = null;

let heading = 0;
let smoothHeading = 0;

// -----------------------------
// GPS START
// -----------------------------
function startGPS() {

  navigator.geolocation.watchPosition(
    (pos) => {

      userLat = pos.coords.latitude;
      userLon = pos.coords.longitude;

      document.getElementById("location").innerText =
        `📍 ${userLat.toFixed(5)}, ${userLon.toFixed(5)}`;

      findHospital();

    },
    (err) => {
      alert("GPS Error: Enable location + use HTTPS/Live Server");
      console.log(err);
    },
    {
      enableHighAccuracy: true
    }
  );
}

startGPS();

// -----------------------------
// FIND NEAREST HOSPITAL
// -----------------------------
async function findHospital() {

  if (!userLat || !userLon) return;

  const url = `
  https://overpass-api.de/api/interpreter?data=
  [out:json];
  node["amenity"="hospital"]
  (around:5000,${userLat},${userLon});
  out;
  `;

  try {

    const res = await fetch(url);
    const data = await res.json();

    if (!data.elements.length) {
      document.getElementById("hospital").innerText =
        "🏥 No hospital found";
      return;
    }

    const h = data.elements[0];

    document.getElementById("hospital").innerText =
      "🏥 " + (h.tags.name || "Hospital");

    const dist = getDistance(userLat, userLon, h.lat, h.lon);

    document.getElementById("distance").innerText =
      "📏 " + dist.toFixed(2) + " km";

    updateDirection(h.lat, h.lon);

  } catch (e) {
    console.log(e);
  }
}

// -----------------------------
// DISTANCE (HAVERSINE)
// -----------------------------
function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

// -----------------------------
// SMOOTH COMPASS
// -----------------------------
window.addEventListener("deviceorientation", (e) => {

  if (e.alpha !== null) {

    heading = 360 - e.alpha;

    // smoothing (VERY IMPORTANT)
    smoothHeading += (heading - smoothHeading) * 0.1;

    document.getElementById("heading").innerText =
      "🧭 Heading: " + smoothHeading.toFixed(0) + "°";
  }
});

// -----------------------------
// AR DIRECTION + AR ARROW ROTATION
// -----------------------------
function updateDirection(hLat, hLon) {

  if (!userLat || !userLon) return;

  let dx = hLon - userLon;
  let dy = hLat - userLat;

  let targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;

  if (targetAngle < 0) targetAngle += 360;

  let relativeAngle = targetAngle - smoothHeading;

  if (relativeAngle < 0) relativeAngle += 360;

  // 🔥 ROTATE AR ARROW
  const arrow = document.getElementById("arrow");

  arrow.setAttribute("rotation", "0 " + relativeAngle + " 0");

  // UI direction text
  let dir = "";

  if (relativeAngle < 45 || relativeAngle > 315) dir = "➡ Forward";
  else if (relativeAngle < 135) dir = "⬆ Left";
  else if (relativeAngle < 225) dir = "⬅ Back";
  else dir = "⬇ Right";

  document.getElementById("direction").innerText =
    "🧭 " + dir;
}