 import { useState } from "react";

function SymptomChecker() {
  const [symptom, setSymptom] = useState("");
  const [result, setResult] = useState("");
  const [severity, setSeverity] = useState("");

  const checkSymptoms = () => {
    const text = symptom.toLowerCase().trim();

    if (!text) {
      alert("Please enter your symptoms.");
      return;
    }

    // Emergency warning symptoms
    if (
      text.includes("chest pain") ||
      text.includes("difficulty breathing") ||
      text.includes("can't breathe") ||
      text.includes("cannot breathe") ||
      text.includes("severe bleeding") ||
      text.includes("unconscious") ||
      text.includes("stroke")
    ) {
      setSeverity("emergency");

      setResult(
        "Your symptoms may require urgent medical attention. Please contact emergency services or go to the nearest emergency department immediately."
      );

      return;
    }

    // Fever / cough
    if (
      text.includes("fever") ||
      text.includes("cough") ||
      text.includes("cold") ||
      text.includes("sore throat")
    ) {
      setSeverity("moderate");

      setResult(
        "These symptoms can occur with several common infections or respiratory conditions. Rest, stay hydrated, and monitor your symptoms. Consult a healthcare professional if symptoms are severe, persistent, or getting worse."
      );

      return;
    }

    // Headache
    if (
      text.includes("headache") ||
      text.includes("migraine")
    ) {
      setSeverity("moderate");

      setResult(
        "Headaches can have many possible causes, including dehydration, stress, lack of sleep, or migraine. Rest and stay hydrated. Seek medical advice if the headache is severe, sudden, unusual, or persistent."
      );

      return;
    }

    // Stomach symptoms
    if (
      text.includes("stomach") ||
      text.includes("vomiting") ||
      text.includes("diarrhea") ||
      text.includes("nausea")
    ) {
      setSeverity("moderate");

      setResult(
        "These symptoms can occur with several digestive conditions. Stay hydrated and eat light foods if tolerated. Seek medical advice if symptoms are severe, persistent, or associated with dehydration or severe abdominal pain."
      );

      return;
    }

    // General symptoms
    setSeverity("general");

    setResult(
      "The symptom checker could not identify a specific category from the information provided. This tool does not diagnose medical conditions. Please consult a qualified healthcare professional for proper evaluation."
    );
  };

  const clearChecker = () => {
    setSymptom("");
    setResult("");
    setSeverity("");
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
      <h2>🤖 Symptom Checker</h2>

      <p style={{ color: "#555" }}>
        Enter your symptoms to receive general health guidance.
      </p>

      <textarea
        placeholder="Example: fever, cough and sore throat"
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          resize: "vertical",
          fontFamily: "Arial, sans-serif",
          fontSize: "15px",
        }}
      />

      <button
        onClick={checkSymptoms}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        🔍 Check Symptoms
      </button>

      {result && (
        <div
          style={{
            marginTop: "18px",
            padding: "15px",
            borderRadius: "10px",
            background:
              severity === "emergency"
                ? "#fee2e2"
                : severity === "moderate"
                ? "#fef3c7"
                : "#eff6ff",
            border:
              severity === "emergency"
                ? "1px solid #ef4444"
                : severity === "moderate"
                ? "1px solid #f59e0b"
                : "1px solid #93c5fd",
          }}
        >
          <strong>
            {severity === "emergency"
              ? "🚨 Urgent Attention"
              : severity === "moderate"
              ? "⚠️ General Guidance"
              : "ℹ️ Information"}
          </strong>

          <p
            style={{
              lineHeight: "1.6",
              marginBottom: 0,
            }}
          >
            {result}
          </p>
        </div>
      )}

      {result && (
        <button
          onClick={clearChecker}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: "white",
            color: "#555",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
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
        ⚠️ This tool provides general information only. It is not a
        diagnosis and should not replace professional medical advice.
      </div>
    </div>
  );
}

export default SymptomChecker;