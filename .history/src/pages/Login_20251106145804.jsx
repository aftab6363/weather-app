import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  // ✅ If already logged in → go directly to dashboard
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {

        // ✅ Save login state
        localStorage.setItem("isLoggedIn", "true");

        // ✅ OPTIONAL: Save basic user data
        localStorage.setItem(
          "loggedUser",
          JSON.stringify({
            email: formData.email,
            lastLogin: new Date().toLocaleString(),
          })
        );

        // ✅ Redirect to Dashboard
        navigate("/Dashboard");

      } else {
        setErrorMessage(result.message);
      }

    } catch (error) {
      setErrorMessage("Server Error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <h2>Login</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="login-button" type="submit"> Login</button>
      </form>
    </div>
  );
}

export default Login;
