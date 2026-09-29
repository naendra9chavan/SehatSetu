 import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

interface EmergencyEvent {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
  userId: string;
}

function EmergencyHistory() {
  const [events, setEvents] = useState<EmergencyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    // Only filter by user.
    // We sort the results in JavaScript,
    // so Firestore does not need a composite index.
    const eventsQuery = query(
      collection(db, "emergencyEvents"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const eventList: EmergencyEvent[] =
          snapshot.docs.map((item) => ({
            id: item.id,
            ...(item.data() as Omit<
              EmergencyEvent,
              "id"
            >),
          }));

        // Sort newest emergency events first
        eventList.sort((a, b) => {
          const timeA =
            a.createdAt?.seconds ?? 0;

          const timeB =
            b.createdAt?.seconds ?? 0;

          return timeB - timeA;
        });

        setEvents(eventList);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Emergency history error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (
    timestamp: EmergencyEvent["createdAt"]
  ) => {
    if (!timestamp) {
      return "Unknown time";
    }

    const date = new Date(
      timestamp.seconds * 1000
    );

    return date.toLocaleString();
  };

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📋 Emergency History</h2>

      <p style={{ color: "#555" }}>
        Your previously activated SOS events.
      </p>

      {loading ? (
        <p>
          Loading emergency history...
        </p>
      ) : events.length === 0 ? (
        <div
          style={{
            padding: "15px",
            marginTop: "15px",
            background: "#f8fafc",
            borderRadius: "10px",
            color: "#666",
          }}
        >
          No emergency events recorded yet.
        </div>
      ) : (
        <div style={{ marginTop: "15px" }}>
          {events.map((event, index) => (
            <div
              key={event.id}
              style={{
                padding: "15px",
                marginTop:
                  index === 0 ? "0" : "10px",
                background: "#fef2f2",
                borderRadius: "10px",
                border:
                  "1px solid #fecaca",
              }}
            >
              <strong>
                🚨 SOS Event #{events.length - index}
              </strong>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#555",
                }}
              >
                🕐{" "}
                {formatDate(event.createdAt)}
              </p>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#555",
                  lineHeight: "1.5",
                }}
              >
                📍 Latitude:{" "}
                {event.latitude.toFixed(6)}
                <br />
                📍 Longitude:{" "}
                {event.longitude.toFixed(6)}
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#991b1b",
                  fontWeight: "bold",
                }}
              >
                Status: {event.status}
              </p>
            </div>
          ))}
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
        🔐 Emergency records are associated
        with your signed-in account.
      </div>
    </div>
  );
}

export default EmergencyHistory;