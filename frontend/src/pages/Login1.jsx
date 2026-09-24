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

  // ================================
  // STATE (BLANK DEFAULT VALUES)
  // ================================

  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [empIdError, setEmpIdError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================================
  // LOGIN FUNCTION
  // ================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setMessage("");
    setEmpIdError(false);
    setPasswordError(false);

    // ================================
    // VALIDATION
    // ================================

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

    setLoading(true);

    try {
      /* =========================================================
         BACKEND API CODE - COMMENTED FOR FRONTEND WORK
      ========================================================= 
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: empId,
            password,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in");
      }

      const user = data.user;
      ========================================================= */

      // =========================================================
      // DUMMY LOGIN DATA & VALIDATION - FOR UI TESTING
      // =========================================================
      
      // ID check
      if (empId !== "10002") {
        setEmpIdError(true);
        throw new Error("Invalid Employee ID");
      }

      // Password check
      if (password !== "1234") {
        setPasswordError(true);
        throw new Error("Invalid Password");
      }

      // INGA THAAN "Admin User" NU IRUNTHATHA "Employee Name" NU MAATHIYACHU
      const user = {
        employeeCode: empId,
        name: "Employee Name", 
        role: "Employee",
        department: "IT Department",
      };
      
      const dummyToken = "dummy-token-12345";
      const dummyRefreshToken = "dummy-refresh-12345";

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", dummyToken);
      localStorage.setItem("refreshToken", dummyRefreshToken);
      localStorage.setItem("empId", user.employeeCode);
      localStorage.setItem("name", user.name);
      localStorage.setItem("role", user.role);
      
      if (user.department) {
        localStorage.setItem("department", user.department);
      } else {
        localStorage.removeItem("department");
      }

      // 1-second delay animation
      setTimeout(() => {
        if (user.role === "Super Admin" || user.role === "Admin") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/employee-dashboard", { replace: true });
        }
      }, 1000);
      
    } catch (error) {
      setMessage(error.message || "Unable to sign in. Please try again");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  // ================================
  // JSX
  // ================================

  return (
    <div className="login-page">

      {/* =================================
          LEFT SIDE
      ================================= */}

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
          Greater Technology Starts with
          <br />

          <strong
            className="fw-bold my-2"
            style={{
              color: "#1F96CB",
            }}
          >
            Great
          </strong>{" "}

          <strong
            className="fw-bold my-2"
            style={{
              color: "#2EAB74",
            }}
          >
            People
          </strong>
        </h1>

        <p className="text-white login-right-text">
          Copyright @ 2026
        </p>

      </div>

      {/* =================================
          RIGHT SIDE
      ================================= */}

      <div className="login-right">

        <div className="login-card">

          <img
            src={logo}
            alt="Victinet Logo"
            className="login-logo"
          />

          <h4
            className="logo-name text-center fw-300"
            style={{
              color: "#2EAB74",
            }}
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

                <span>
                  {message}
                </span>

              </p>
            )}

          </div>

          {/* LOGIN FORM */}

          <form
            onSubmit={handleLogin}
            className="my-auto"
          >

            <label className="input-label">
              EMPLOYEE ID
            </label>

            <div
              className={`input-box ${
                empIdError
                  ? "input-error"
                  : ""
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
                autoComplete="off"
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

            <label className="input-label">
              PASSWORD
            </label>

            <div
              className={`input-box ${
                passwordError
                  ? "input-error"
                  : ""
              }`}
            >

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                  setMessage("");
                }}
                autoComplete="off"
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

              <span
                className="password-icon"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <EyeIcon size={18} />
                ) : (
                  <EyeOffIcon size={18} />
                )}

              </span>

            </div>

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

            <div className="login-button-container">

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "LOGGING IN..."
                  : "LOGIN"}
              </button>

            </div>

          </form>

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