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

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    document.getElementById("location").innerHTML =
      "Finding nearby emergency services...";

    try {

      const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:15000,${lat},${lon});
        node["amenity"="police"](around:15000,${lat},${lon});
        node["amenity"="fire_station"](around:15000,${lat},${lon});
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
      let nearestPolice = null;
      let nearestFire = null;

      let hospitalDist = Infinity;
      let policeDist = Infinity;
      let fireDist = Infinity;

      data.elements.forEach(place => {

        const distance = getDistance(
          lat,
          lon,
          place.lat,
          place.lon
        );

        if (place.tags.amenity === "hospital") {
          if (distance < hospitalDist) {
            hospitalDist = distance;
            nearestHospital = place;
          }
        }

        if (place.tags.amenity === "police") {
          if (distance < policeDist) {
            policeDist = distance;
            nearestPolice = place;
          }
        }

        if (place.tags.amenity === "fire_station") {
          if (distance < fireDist) {
            fireDist = distance;
            nearestFire = place;
          }
        }

      });

      let html = `
      <b>🚨 RescueAR Emergency Services</b><br><br>
      📍 Your Location<br>
      Lat: ${lat.toFixed(5)}<br>
      Lon: ${lon.toFixed(5)}
      <br><br>
      `;

      if (nearestHospital) {
        html += `
        🏥 <b>Nearest Hospital</b><br>
        ${nearestHospital.tags.name || "Unknown Hospital"}<br>
        Distance: ${hospitalDist.toFixed(2)} km
        <br><br>
        `;
      }

      if (nearestPolice) {
        html += `
        🚓 <b>Nearest Police Station</b><br>
        ${nearestPolice.tags.name || "Unknown Police Station"}<br>
        Distance: ${policeDist.toFixed(2)} km
        <br><br>
        `;
      }

      if (nearestFire) {
        html += `
        🚒 <b>Nearest Fire Station</b><br>
        ${nearestFire.tags.name || "Unknown Fire Station"}<br>
        Distance: ${fireDist.toFixed(2)} km
        <br><br>
        `;
      }

      document.getElementById("location").innerHTML = html;

    } catch (error) {

      console.error(error);

      document.getElementById("location").innerHTML =
        "Failed to fetch emergency service data.";
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