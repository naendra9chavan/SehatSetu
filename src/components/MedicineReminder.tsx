 import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase";

interface Medicine {
  id: string;
  name: string;
  time: string;
  userId: string;
  taken?: boolean;
}

function MedicineReminder() {
  const [medicineName, setMedicineName] = useState("");
  const [medicineTime, setMedicineTime] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const medicinesRef = collection(db, "medicines");

    const q = query(
      medicinesRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const medicineList: Medicine[] = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...(item.data() as Omit<Medicine, "id">),
          })
        );

        medicineList.sort((a, b) =>
          a.time.localeCompare(b.time)
        );

        setMedicines(medicineList);
      },
      (error) => {
        console.error("Medicine listener error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const addMedicine = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!medicineName.trim() || !medicineTime) {
      alert("Please enter medicine name and time.");
      return;
    }

    try {
      await addDoc(collection(db, "medicines"), {
        name: medicineName.trim(),
        time: medicineTime,
        userId: user.uid,
        taken: false,
        createdAt: new Date(),
      });

      setMedicineName("");
      setMedicineTime("");

      alert("Medicine added successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to add medicine.");
    }
  };

  const toggleTaken = async (
    medicine: Medicine
  ) => {
    try {
      await updateDoc(
        doc(db, "medicines", medicine.id),
        {
          taken: !medicine.taken,
        }
      );
    } catch (error) {
      console.error(error);
      alert("Unable to update medicine status.");
    }
  };

  const deleteMedicine = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this medicine?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "medicines", id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete medicine.");
    }
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
      <h2>💊 Medicine Reminder</h2>

      <p>
        Add medicines and track whether they
        have been taken.
      </p>

      {/* ADD MEDICINE */}

      <input
        type="text"
        placeholder="Medicine name"
        value={medicineName}
        onChange={(e) =>
          setMedicineName(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <input
        type="time"
        value={medicineTime}
        onChange={(e) =>
          setMedicineTime(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={addMedicine}
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ➕ Add Medicine
      </button>

      {/* MEDICINE LIST */}

      <div style={{ marginTop: "20px" }}>
        <h3>Today's Medicines</h3>

        {medicines.length === 0 ? (
          <p>
            No medicines added yet.
          </p>
        ) : (
          medicines.map((medicine) => (
            <div
              key={medicine.id}
              style={{
                padding: "15px",
                marginTop: "10px",
                background: medicine.taken
                  ? "#f0fdf4"
                  : "#f4f7fc",
                borderRadius: "10px",
                border: medicine.taken
                  ? "1px solid #86efac"
                  : "1px solid #e5e7eb",
              }}
            >
              {/* MEDICINE INFO */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>
                    💊 {medicine.name}
                  </strong>

                  <br />

                  <span>
                    ⏰ {medicine.time}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: medicine.taken
                      ? "#15803d"
                      : "#ca8a04",
                  }}
                >
                  {medicine.taken
                    ? "✓ Taken"
                    : "⏳ Pending"}
                </div>
              </div>

              {/* ACTION BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                }}
              >
                <button
                  onClick={() =>
                    toggleTaken(medicine)
                  }
                  style={{
                    flex: 1,
                    padding: "9px",
                    background: medicine.taken
                      ? "#f59e0b"
                      : "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  {medicine.taken
                    ? "↩ Mark Pending"
                    : "✓ Mark as Taken"}
                </button>

                <button
                  onClick={() =>
                    deleteMedicine(
                      medicine.id
                    )
                  }
                  style={{
                    padding: "9px 14px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SAFETY MESSAGE */}

      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "#f8fafc",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#666",
          lineHeight: "1.5",
        }}
      >
        💡 Reminder tracking is for personal
        organization. Follow your healthcare
        professional's instructions for medication
        use.
      </div>
    </div>
  );
}

export default MedicineReminder;