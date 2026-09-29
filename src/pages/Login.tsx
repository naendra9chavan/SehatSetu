 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        alert("Account created successfully!");
        navigate("/dashboard");
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);

      if (
        error.code ===
        "auth/email-already-in-use"
      ) {
        alert(
          "This email is already registered. Please login."
        );
      } else if (
        error.code ===
          "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Incorrect email or password.");
      } else if (
        error.code === "auth/user-not-found"
      ) {
        alert("No account found with this email.");
      } else if (
        error.code === "auth/invalid-email"
      ) {
        alert("Please enter a valid email address.");
      } else {
        alert(
          error.message ||
            "Authentication failed."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eff6ff, #f0fdf4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "950px",
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.12)",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {/* LEFT SIDE */}

        <div
          style={{
            padding: "45px",
            background:
              "linear-gradient(135deg, #1e3a8a, #2563eb)",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "10px",
            }}
          >
            🏥
          </div>

          <h1
            style={{
              fontSize: "42px",
              margin: "0 0 10px",
            }}
          >
            SehatSetu
          </h1>

          <h2
            style={{
              fontWeight: "normal",
              lineHeight: "1.4",
            }}
          >
            Smart Healthcare &
            Family Safety
          </h2>

          <p
            style={{
              lineHeight: "1.7",
              opacity: 0.9,
              marginTop: "25px",
            }}
          >
            One platform to help you manage
            medicines, family care, symptoms,
            emergency support and nearby
            healthcare services.
          </p>

          <div
            style={{
              marginTop: "30px",
              lineHeight: "2",
            }}
          >
            <div>💊 Medicine Tracking</div>
            <div>👨‍👩‍👧‍👦 Family Care Circle</div>
            <div>🤖 Symptom Guidance</div>
            <div>🚨 Emergency SOS</div>
            <div>🏥 Nearby Hospitals</div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            padding: "45px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#1e3a8a",
              marginBottom: "8px",
            }}
          >
            {isSignup
              ? "Create Your Account"
              : "Welcome Back"}
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "30px",
            }}
          >
            {isSignup
              ? "Start using SehatSetu today"
              : "Login to your SehatSetu dashboard"}
          </p>

          {/* EMAIL */}

          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "9px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          {/* PASSWORD */}

          <label
            style={{
              display: "block",
              marginTop: "18px",
              marginBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "9px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />

          {/* SUBMIT */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "22px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "9px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>

          {/* SWITCH */}

          <button
            onClick={() =>
              setIsSignup(!isSignup)
            }
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "12px",
              background: "white",
              color: "#2563eb",
              border:
                "1px solid #2563eb",
              borderRadius: "9px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            {isSignup
              ? "Already have an account? Login"
              : "New user? Create Account"}
          </button>

          {/* SAFETY */}

          <div
            style={{
              marginTop: "25px",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "8px",
              color: "#666",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            🔐 Your healthcare data is
            associated with your account and
            protected using Firebase
            authentication and Firestore
            security rules.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;