let userLat, userLon;
let heading = 0;

const locationText = document.getElementById("location");
const hospitalText = document.getElementById("hospital");
const distanceText = document.getElementById("distance");
const directionText = document.getElementById("direction");
const headingText = document.getElementById("heading");

// -----------------------------
// CAMERA + GPS
// -----------------------------
navigator.geolocation.watchPosition(async (pos) => {

  userLat = pos.coords.latitude;
  userLon = pos.coords.longitude;

  locationText.innerText =
    `📍 ${userLat.toFixed(4)}, ${userLon.toFixed(4)}`;

  await findHospital();

});

// -----------------------------
// NEAREST HOSPITAL (OSM)
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
      hospitalText.innerText = "🏥 No hospital found";
      return;
    }

    const h = data.elements[0];

    hospitalText.innerText =
      "🏥 " + (h.tags.name || "Hospital");

    const dist = getDistance(userLat, userLon, h.lat, h.lon);

    distanceText.innerText =
      "📏 " + dist.toFixed(2) + " km";

    updateDirection(h.lat, h.lon);

  } catch (e) {
    hospitalText.innerText = "Error loading hospital";
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
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// -----------------------------
// COMPASS
// -----------------------------
window.addEventListener("deviceorientation", (e) => {

  if (e.alpha !== null) {
    heading = 360 - e.alpha;
    heading = Math.round(heading);

    headingText.innerText = `🧭 Heading: ${heading}°`;
  }
});

// -----------------------------
// DIRECTION CALCULATION
// -----------------------------
function updateDirection(lat2, lon2) {

  let dx = lon2 - userLon;
  let dy = lat2 - userLat;

  let angle = Math.atan2(dy, dx) * 180 / Math.PI;

  if (angle < 0) angle += 360;

  let relative = angle - heading;

  if (relative < 0) relative += 360;

  let dir = "";

  if (relative < 45 || relative > 315) dir = "➡ East";
  else if (relative < 135) dir = "⬆ North";
  else if (relative < 225) dir = "⬅ West";
  else dir = "⬇ South";

  directionText.innerText = "🧭 " + dir;

  // -----------------------------
  // MOVE AR OBJECT BASED ON DIRECTION
  // -----------------------------
  const marker = document.getElementById("arMarker");

  let z = -3;

  if (dir.includes("North")) marker.setAttribute("position", "0 1 " + z);
  if (dir.includes("South")) marker.setAttribute("position", "0 -1 " + z);
  if (dir.includes("East")) marker.setAttribute("position", "1 0 " + z);
  if (dir.includes("West")) marker.setAttribute("position", "-1 0 " + z);
}