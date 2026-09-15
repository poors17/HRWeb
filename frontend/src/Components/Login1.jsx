import { useState } from "react";
import "./Login.css";

import login from "../assets/login page background.png";
import logo from "../assets/victinet.png";
import logo1 from "../assets/square logo.png";
import warning from "../assets/warning-svgrepo-com (1).svg";

import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login1() {
  const navigate = useNavigate();

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [empIdError, setEmpIdError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login credentials
    const users = [
      {
        empId: "10001",
        password: "123",
        role: "Admin",
      },
      {
        empId: "10002",
        password: "1234",
        role: "Employee",
      },
      {
        empId: "10003",
        password: "k1234",
        role: "Employee",
      },
    ];

    // Reset previous errors
    setMessage("");
    setEmpIdError(false);
    setPasswordError(false);

    // Validation
    if (!empId && !password) {
      setMessage("Enter the ID and Password");
      setEmpIdError(true);
      setPasswordError(true);
      return;
    }

    if (!empId) {
      setMessage("Enter the ID");
      setEmpIdError(true);
      return;
    }

    if (!password) {
      setMessage("Enter the Password");
      setPasswordError(true);
      return;
    }

    // Check user
    const user = users.find(
      (item) =>
        item.empId === empId &&
        item.password === password
    );

    if (!user) {
      setMessage("ID or Password incorrect. Please try again");
      setEmpIdError(true);
      setPasswordError(true);
      return;
    }

    // Save login information
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("empId", user.empId);
    localStorage.setItem("role", user.role);

    // Navigate to dashboard
    if (user.role === "Employee") {
  navigate("/employee-dashboard");
} else if (user.role === "Admin") {
  navigate("/dashboard");
}
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        <img
          src={login}
          alt="Login Illustration"
          className="login-image"
        />

        <img
          src={logo1}
          alt="Victinet Logo"
          className="bottom-logo"
        />

        <h1 className="text-white login-title">
          Greater Technology Starts with <br />

          <strong
            className="fw-bold my-2"
            style={{ color: "#1F96CB" }}
          >
            Great
          </strong>{" "}

          <strong
            className="fw-bold my-2"
            style={{ color: "#2EAB74" }}
          >
            People
          </strong>
        </h1>

        <p className="text-white login-right-text">
          Copyright @ 2026
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          {/* VICTINET LOGO */}
          <img
            src={logo}
            alt="Victinet Logo"
            className="login-logo"
          />

          {/* WELCOME */}
          <h4
            className="logo-name text-center fw-300"
            style={{ color: "#2EAB74" }}
          >
            Welcome{" "}

            <span
              style={{
                fontSize: "36px",
                color: "#3e9cd5",
              }}
            >
              Back!
            </span>
          </h4>

          <p className="text-center para">
            Sign in to your account to continue
          </p>

          {/* ERROR MESSAGE */}
          <div className="login-message-space">

            {message && (
              <p className="login-message">

                <img
                  src={warning}
                  alt="Warning"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />

                <span>{message}</span>

              </p>
            )}

          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleLogin}
            className="my-auto"
          >

            {/* EMPLOYEE ID */}
            <label className="input-label">
              EMPLOYEE ID
            </label>

            <div
              className={`input-box ${
                empIdError ? "input-error" : ""
              }`}
            >

              <input
                type="text"
                value={empId}
                onChange={(e) => {
                  setEmpId(e.target.value);
                  setEmpIdError(false);
                  setMessage("");
                }}
                autoComplete="username"
                style={{
                  width: "335px",
                  height: "44px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  color: "#000000",
                }}
              />

            </div>

            {/* PASSWORD */}
            <label className="input-label">
              PASSWORD
            </label>

            <div
              className={`input-box ${
                passwordError ? "input-error" : ""
              }`}
            >

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                  setMessage("");
                }}
                autoComplete="current-password"
                style={{
                  width: "335px",
                  height: "44px",
                  padding: "0",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "16px",
                  color: "#000000",
                }}
              />

              {/* PASSWORD EYE */}
              <span
                className="password-icon"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword ? (
                  <EyeIcon size={18} />
                ) : (
                  <EyeOffIcon size={18} />
                )}

              </span>

            </div>

            {/* REMEMBER ME / FORGOT PASSWORD */}
            <div className="login-links">

              <label className="signin-text">

                <input
                  type="checkbox"
                  name="rememberMe"
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <div className="login-button-container">

              <button
                type="submit"
                className="login-button"
              >
                LOGIN
              </button>

            </div>

          </form>

          {/* HR SUPPORT */}
          <h5 className="text-center need">
            Need a Help?{" "}

            <span>
              Contact HR Support
            </span>
          </h5>

        </div>

      </div>

    </div>
  );
}

export default Login1;