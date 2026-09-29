 import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db, auth } from "../firebase";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone: string;
  userId: string;
}

function FamilyCare() {
  const [memberName, setMemberName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const membersRef = collection(
      db,
      "familyMembers"
    );

    const q = query(
      membersRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const memberList: FamilyMember[] =
          snapshot.docs.map((item) => ({
            id: item.id,
            ...(item.data() as Omit<
              FamilyMember,
              "id"
            >),
          }));

        setMembers(memberList);
      },
      (error) => {
        console.error(
          "Family listener error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  const addMember = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (
      !memberName.trim() ||
      !relation.trim() ||
      !phone.trim()
    ) {
      alert(
        "Please enter name, relation and phone number."
      );
      return;
    }

    if (phone.trim().length < 10) {
      alert(
        "Please enter a valid phone number."
      );
      return;
    }

    try {
      await addDoc(
        collection(db, "familyMembers"),
        {
          name: memberName.trim(),
          relation: relation.trim(),
          phone: phone.trim(),
          userId: user.uid,
          createdAt: new Date(),
        }
      );

      setMemberName("");
      setRelation("");
      setPhone("");

      alert(
        "Family member added successfully!"
      );
    } catch (error) {
      console.error(error);
      alert(
        "Unable to add family member."
      );
    }
  };

  const deleteMember = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Delete this family member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "familyMembers", id)
      );
    } catch (error) {
      console.error(error);
      alert(
        "Unable to delete family member."
      );
    }
  };

  const callMember = (phone: string) => {
    window.location.href = `tel:${phone}`;
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
      <h2>
        👨‍👩‍👧‍👦 Family Care Circle
      </h2>

      <p>
        Add trusted family members who can
        support you during healthcare needs.
      </p>

      {/* NAME */}

      <input
        type="text"
        placeholder="Family member name"
        value={memberName}
        onChange={(e) =>
          setMemberName(e.target.value)
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

      {/* RELATION */}

      <input
        type="text"
        placeholder="Relation (Father, Mother, Brother...)"
        value={relation}
        onChange={(e) =>
          setRelation(e.target.value)
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

      {/* PHONE */}

      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) =>
          setPhone(e.target.value)
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

      {/* ADD BUTTON */}

      <button
        onClick={addMember}
        style={{
          width: "100%",
          marginTop: "15px",
          padding: "12px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ➕ Add Family Member
      </button>

      {/* MEMBER LIST */}

      <div style={{ marginTop: "20px" }}>
        <h3>Family Members</h3>

        {members.length === 0 ? (
          <p>
            No family members added yet.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              style={{
                padding: "15px",
                marginTop: "10px",
                background: "#f0fdf4",
                borderRadius: "10px",
                border:
                  "1px solid #bbf7d0",
              }}
            >
              <div>
                <strong>
                  👤 {member.name}
                </strong>

                <br />

                <span>
                  ❤️ {member.relation}
                </span>

                <br />

                <span>
                  📞 {member.phone}
                </span>
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
                    callMember(member.phone)
                  }
                  style={{
                    flex: 1,
                    padding: "9px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  📞 Call
                </button>

                <button
                  onClick={() =>
                    deleteMember(member.id)
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

      {/* INFORMATION */}

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
        💡 Add trusted contacts who may be
        useful during healthcare or emergency
        situations.
      </div>
    </div>
  );
}

export default FamilyCare;