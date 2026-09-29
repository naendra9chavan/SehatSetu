 import { useEffect, useState } from "react";

import { signOut } from "firebase/auth";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import FamilyCare from "../components/FamilyCare";
import EmergencySOS from "../components/EmergencySOS";
import EmergencyHistory from "../components/EmergencyHistory";
import MedicineReminder from "../components/MedicineReminder";
import SymptomChecker from "../components/SymptomChecker";
import NearbyHospitals from "../components/NearbyHospitals";

import { auth, db } from "../firebase";

function Dashboard() {
  const user = auth.currentUser;

  const [medicineCount, setMedicineCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    // ==============================
    // MEDICINE COUNT
    // ==============================

    const medicineQuery = query(
      collection(db, "medicines"),
      where("userId", "==", user.uid)
    );

    const unsubscribeMedicines = onSnapshot(
      medicineQuery,
      (snapshot) => {
        setMedicineCount(snapshot.size);
      },
      (error) => {
        console.error(
          "Medicine count error:",
          error
        );
      }
    );

    // ==============================
    // FAMILY MEMBER COUNT
    // ==============================

    const familyQuery = query(
      collection(db, "familyMembers"),
      where("userId", "==", user.uid)
    );

    const unsubscribeFamily = onSnapshot(
      familyQuery,
      (snapshot) => {
        setFamilyCount(snapshot.size);
      },
      (error) => {
        console.error(
          "Family count error:",
          error
        );
      }
    );

    // ==============================
    // EMERGENCY EVENT COUNT
    // ==============================

    const emergencyQuery = query(
      collection(db, "emergencyEvents"),
      where("userId", "==", user.uid)
    );

    const unsubscribeEmergency = onSnapshot(
      emergencyQuery,
      (snapshot) => {
        setEmergencyCount(snapshot.size);
      },
      (error) => {
        console.error(
          "Emergency count error:",
          error
        );
      }
    );

    return () => {
      unsubscribeMedicines();
      unsubscribeFamily();
      unsubscribeEmergency();
    };
  }, [user]);

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      alert("Unable to logout.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f7fc, #eef6ff)",
        padding: "25px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ==============================
          HEADER
      ============================== */}

      <div
        style={{
          background: "white",
          padding: "28px",
          borderRadius: "18px",
          marginBottom: "20px",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                color: "#1e3a8a",
                margin: 0,
                fontSize: "32px",
              }}
            >
              🏥 SehatSetu
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#2563eb",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              SMART HEALTHCARE • FAMILY SAFETY
            </p>

            <p
              style={{
                color: "#555",
                marginTop: "12px",
                marginBottom: 0,
                lineHeight: "1.5",
              }}
            >
              Your personal healthcare companion
              for medicines, family care and
              emergencies.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "12px 20px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            🚪 Logout
          </button>
        </div>

        <div
          style={{
            marginTop: "22px",
            padding: "14px",
            background: "#eff6ff",
            borderRadius: "10px",
            border: "1px solid #dbeafe",
          }}
        >
          👤 Logged in as:{" "}
          <strong>{user?.email}</strong>
        </div>
      </div>

      {/* ==============================
          QUICK NAVIGATION
      ============================== */}

      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "15px",
          marginBottom: "20px",
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.07)",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "sticky",
          top: "10px",
          zIndex: 10,
        }}
      >
        <a
          href="#emergency"
          style={{
            padding: "10px 15px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          🚨 Emergency
        </a>

        <a
          href="#medicine"
          style={{
            padding: "10px 15px",
            background: "#eff6ff",
            color: "#1e40af",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          💊 Medicines
        </a>

        <a
          href="#family"
          style={{
            padding: "10px 15px",
            background: "#f0fdf4",
            color: "#166534",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          👨‍👩‍👧‍👦 Family
        </a>

        <a
          href="#symptoms"
          style={{
            padding: "10px 15px",
            background: "#fefce8",
            color: "#854d0e",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          🤖 Symptoms
        </a>

        <a
          href="#hospitals"
          style={{
            padding: "10px 15px",
            background: "#f5f3ff",
            color: "#5b21b6",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          🏥 Hospitals
        </a>

        <a
          href="#history"
          style={{
            padding: "10px 15px",
            background: "#fff7ed",
            color: "#9a3412",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          📋 History
        </a>

        <a
          href="#overview"
          style={{
            padding: "10px 15px",
            background: "#f3f4f6",
            color: "#374151",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          📊 Overview
        </a>
      </div>

      {/* ==============================
          QUICK STATS
      ============================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        {/* MEDICINES */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ fontSize: "28px" }}>
            💊
          </div>

          <h3>Medicines</h3>

          <strong
            style={{
              fontSize: "28px",
              color: "#2563eb",
            }}
          >
            {medicineCount}
          </strong>

          <p
            style={{
              color: "#666",
              fontSize: "13px",
            }}
          >
            Medicines tracked
          </p>
        </div>

        {/* FAMILY */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ fontSize: "28px" }}>
            👨‍👩‍👧‍👦
          </div>

          <h3>Family Care</h3>

          <strong
            style={{
              fontSize: "28px",
              color: "#16a34a",
            }}
          >
            {familyCount}
          </strong>

          <p
            style={{
              color: "#666",
              fontSize: "13px",
            }}
          >
            Family members
          </p>
        </div>

        {/* EMERGENCY */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ fontSize: "28px" }}>
            🚨
          </div>

          <h3>Emergency Events</h3>

          <strong
            style={{
              fontSize: "28px",
              color: "#dc2626",
            }}
          >
            {emergencyCount}
          </strong>

          <p
            style={{
              color: "#666",
              fontSize: "13px",
            }}
          >
            SOS events recorded
          </p>
        </div>

        {/* HOSPITALS */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ fontSize: "28px" }}>
            🏥
          </div>

          <h3>Hospitals</h3>

          <strong
            style={{
              fontSize: "20px",
              color: "#7c3aed",
            }}
          >
            AVAILABLE
          </strong>

          <p
            style={{
              color: "#666",
              fontSize: "13px",
            }}
          >
            Nearby search
          </p>
        </div>
      </div>

      {/* ==============================
          MAIN COMPONENTS
      ============================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {/* EMERGENCY SOS */}

        <div
          id="emergency"
          style={{
            scrollMarginTop: "100px",
          }}
        >
          <EmergencySOS />
        </div>

        {/* MEDICINE REMINDER */}

        <div
          id="medicine"
          style={{
            scrollMarginTop: "100px",
          }}
        >
          <MedicineReminder />
        </div>

        {/* FAMILY CARE */}

        <div
          id="family"
          style={{
            scrollMarginTop: "100px",
          }}
        >
          <FamilyCare />
        </div>

        {/* SYMPTOM CHECKER */}

        <div
          id="symptoms"
          style={{
            scrollMarginTop: "100px",
          }}
        >
          <SymptomChecker />
        </div>

        {/* NEARBY HOSPITALS */}

        <div
          id="hospitals"
          style={{
            scrollMarginTop: "100px",
          }}
        >
          <NearbyHospitals />
        </div>

        {/* EMERGENCY HISTORY */}

        <div
          id="history"
          style={{
            scrollMarginTop: "100px",
          }}
        >
          <EmergencyHistory />
        </div>

        {/* ==============================
            HEALTH OVERVIEW
        ============================== */}

        <div
          id="overview"
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.08)",
            scrollMarginTop: "100px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#1e3a8a",
            }}
          >
            📊 Health Overview
          </h2>

          {/* MEDICINES */}

          <div
            style={{
              padding: "15px",
              marginTop: "15px",
              background: "#eff6ff",
              borderRadius: "10px",
            }}
          >
            <strong>💊 Medicines</strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
              }}
            >
              {medicineCount} medicine
              {medicineCount === 1
                ? ""
                : "s"} currently tracked.
            </p>
          </div>

          {/* FAMILY */}

          <div
            style={{
              padding: "15px",
              marginTop: "12px",
              background: "#f0fdf4",
              borderRadius: "10px",
            }}
          >
            <strong>
              👨‍👩‍👧‍👦 Family Care
            </strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
              }}
            >
              {familyCount} family member
              {familyCount === 1
                ? ""
                : "s"} in your care circle.
            </p>
          </div>

          {/* EMERGENCY EVENTS */}

          <div
            style={{
              padding: "15px",
              marginTop: "12px",
              background: "#fef2f2",
              borderRadius: "10px",
            }}
          >
            <strong>
              🚨 Emergency Events
            </strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
              }}
            >
              {emergencyCount} SOS event
              {emergencyCount === 1
                ? ""
                : "s"} recorded.
            </p>
          </div>

          {/* SYMPTOM CHECKER */}

          <div
            style={{
              padding: "15px",
              marginTop: "12px",
              background: "#fefce8",
              borderRadius: "10px",
            }}
          >
            <strong>
              🤖 Symptom Checker
            </strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
              }}
            >
              ✅ General health guidance
              available
            </p>
          </div>

          {/* HOSPITALS */}

          <div
            style={{
              padding: "15px",
              marginTop: "12px",
              background: "#f5f3ff",
              borderRadius: "10px",
            }}
          >
            <strong>
              🏥 Nearby Hospitals
            </strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
              }}
            >
              ✅ Nearby healthcare search
              available
            </p>
          </div>

          {/* HISTORY */}

          <div
            style={{
              padding: "15px",
              marginTop: "12px",
              background: "#fff7ed",
              borderRadius: "10px",
            }}
          >
            <strong>
              📋 Emergency History
            </strong>

            <p
              style={{
                margin: "5px 0 0",
                color: "#666",
              }}
            >
              ✅ Previous SOS events are
              recorded securely.
            </p>
          </div>
        </div>
      </div>

      {/* ==============================
          FOOTER
      ============================== */}

      <div
        style={{
          textAlign: "center",
          marginTop: "35px",
          padding: "20px",
          color: "#666",
          fontSize: "14px",
        }}
      >
        <p
          style={{
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          ❤️ SehatSetu
        </p>

        <p style={{ margin: 0 }}>
          Connecting people with safer and
          smarter healthcare.
        </p>

        <p
          style={{
            marginTop: "12px",
            fontSize: "12px",
          }}
        >
          ⚠️ SehatSetu provides general health
          guidance and is not a substitute for
          professional medical advice.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;