import { useState } from "react";

function NearbyHospitals() {
  const [loading, setLoading] = useState(false);
  const [locationFound, setLocationFound] = useState(false);

  const findHospitals = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocationFound(true);
        setLoading(false);

        // Open Google Maps with nearby hospitals
        const mapsUrl =
          `https://www.google.com/maps/search/hospitals/@` +
          `${latitude},${longitude},14z`;

        window.open(mapsUrl, "_blank");
      },
      () => {
        setLoading(false);
        alert(
          "Unable to access your location. Please allow location permission."
        );
      }
    );
  };

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>🏥 Nearby Hospitals</h2>

      <p>
        Find hospitals and clinics near your current location.
      </p>

      <button
        onClick={findHospitals}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "📍 Finding Hospitals..." : "🏥 Find Nearby Hospitals"}
      </button>

      {locationFound && (
        <p
          style={{
            marginTop: "15px",
            color: "#15803d",
          }}
        >
          ✅ Location found. Opening nearby hospitals...
        </p>
      )}
    </div>
  );
}

export default NearbyHospitals;