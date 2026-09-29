 import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

import { db, auth } from "../firebase";

function EmergencySOS() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mapsUrl, setMapsUrl] = useState("");

  const saveEmergencyEvent = async (
    latitude: number,
    longitude: number
  ) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return false;
    }

    try {
      await addDoc(collection(db, "emergencyEvents"), {
        userId: user.uid,
        latitude,
        longitude,
        createdAt: new Date(),
        status: "activated",
      });

      return true;
    } catch (error) {
      console.error(
        "Emergency event error:",
        error
      );

      alert(
        "Location was found, but the emergency event could not be saved."
      );

      return false;
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Location is not supported by this browser."
      );
      return;
    }

    setLoading(true);
    setSaved(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation(
          `Latitude: ${latitude.toFixed(
            6
          )}, Longitude: ${longitude.toFixed(6)}`
        );

        const url =
          `https://www.google.com/maps/search/?api=1&query=` +
          `${latitude},${longitude}`;

        setMapsUrl(url);

        const success =
          await saveEmergencyEvent(
            latitude,
            longitude
          );

        setSaved(success);
        setSosActive(true);
        setLoading(false);
      },
      () => {
        setLoading(false);

        alert(
          "Unable to get your location. Please allow location permission."
        );
      }
    );
  };

  const triggerSOS = () => {
    const confirmed = window.confirm(
      "Are you sure you want to activate Emergency SOS?"
    );

    if (!confirmed) {
      return;
    }

    getLocation();
  };

  const callEmergency = () => {
    window.location.href = "tel:112";
  };

  const openLocation = () => {
    if (mapsUrl) {
      window.open(
        mapsUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow:
          "0 3px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h2>🚨 Emergency SOS</h2>

      <p
        style={{
          color: "#555",
          lineHeight: "1.5",
        }}
      >
        Quickly save your current location
        and access emergency assistance.
      </p>

      <button
        onClick={triggerSOS}
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          background: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: loading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {loading
          ? "📍 Getting Location..."
          : "🚨 ACTIVATE SOS"}
      </button>

      {sosActive && (
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            background: "#fee2e2",
            borderRadius: "10px",
            border: "1px solid #fecaca",
          }}
        >
          <strong>
            🚨 SOS Activated
          </strong>

          <p
            style={{
              color: "#555",
              lineHeight: "1.5",
            }}
          >
            📍 {location}
          </p>

          {saved && (
            <p
              style={{
                color: "#15803d",
                fontWeight: "bold",
              }}
            >
              ✅ Emergency event saved
              securely.
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            <button
              onClick={callEmergency}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "10px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📞 Call 112
            </button>

            <button
              onClick={openLocation}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "10px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📍 View Location
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "18px",
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#666",
          lineHeight: "1.5",
        }}
      >
        ⚠️ This is a prototype emergency
        assistance feature. In a real emergency,
        contact local emergency services directly.
      </div>
    </div>
  );
}

export default EmergencySOS;