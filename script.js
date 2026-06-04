let hospitalLat = null;
let hospitalLon = null;
let userLat = null;
let userLon = null;

const video = document.getElementById("camera");

navigator.mediaDevices
  .getUserMedia({
    video: {
      facingMode: "environment"
    }
  })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Camera Error:", err);
  });

navigator.geolocation.getCurrentPosition(
  async (pos) => {

    userLat = pos.coords.latitude;
    userLon = pos.coords.longitude;

    document.getElementById("location").innerHTML =
      "Finding nearby emergency services...";

    try {

      const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:15000,${userLat},${userLon});
      );
      out;
      `;

      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query
        }
      );

      const data = await response.json();

      let nearestHospital = null;
      let hospitalDist = Infinity;

      data.elements.forEach(place => {

        const distance = getDistance(
          userLat,
          userLon,
          place.lat,
          place.lon
        );

        if (distance < hospitalDist) {
          hospitalDist = distance;
          nearestHospital = place;
        }

      });

      let html = `
      <b>🚨 RescueAR Emergency Navigation</b><br><br>

      📍 Your Location<br>
      Lat: ${userLat.toFixed(5)}<br>
      Lon: ${userLon.toFixed(5)}
      <br><br>
      `;

      if (nearestHospital) {

        hospitalLat = nearestHospital.lat;
        hospitalLon = nearestHospital.lon;

        html += `
        🏥 <b>Nearest Hospital</b><br>
        ${nearestHospital.tags.name || "Unknown Hospital"}<br>
        Distance: ${hospitalDist.toFixed(2)} km
        <br><br>
        🧭 Rotate your phone to align the arrow.
        `;
      }

      document.getElementById("location").innerHTML = html;

    } catch (error) {

      console.error(error);

      document.getElementById("location").innerHTML =
        "Failed to fetch hospital data.";
    }

  },
  (error) => {

    console.error(error);

    document.getElementById("location").innerHTML =
      "Location access denied.";
  }
);

function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) * Math.PI / 180;

  const dLon =
    (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function getBearing(lat1, lon1, lat2, lon2) {

  const dLon =
    (lon2 - lon1) * Math.PI / 180;

  const y =
    Math.sin(dLon) *
    Math.cos(lat2 * Math.PI / 180);

  const x =
    Math.cos(lat1 * Math.PI / 180) *
    Math.sin(lat2 * Math.PI / 180) -

    Math.sin(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.cos(dLon);

  let bearing =
    Math.atan2(y, x) *
    180 / Math.PI;

  return (bearing + 360) % 360;
}

window.addEventListener(
  "deviceorientation",
  (event) => {

    if (
      hospitalLat === null ||
      hospitalLon === null
    ) {
      return;
    }

    const heading =
      event.alpha || 0;

    const targetBearing =
      getBearing(
        userLat,
        userLon,
        hospitalLat,
        hospitalLon
      );

    const rotation =
      targetBearing - heading;

    const arrow =
      document.getElementById("direction");

    if (arrow) {
      arrow.style.transform =
        `rotate(${rotation}deg)`;
    }

  }
);