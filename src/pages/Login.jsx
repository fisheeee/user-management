import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(""); // Add state for role

  // Get user data and role after login
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData(); // Only fetch user data if the token exists
    }
  }, []);

  // Fetch user data to check the role
  async function getUserData() {
    const access_token = localStorage.getItem("token"); // Get token from localStorage

    const options = {
      method: "GET",
      url: "http://172.16.85.51:8000/api/auth/me",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };
    console.log("Test", access_token);
    try {
      const { data } = await axios.request(options);
      console.log("User Data:", data.payload);

      // Set role state based on the response
      setRole(data.payload.role); // Assuming the response includes a `role` property
      navigate(`/dashboard/${data.payload.role}/${data.payload.sub}`); // Navigate based on the role
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch user data.");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      if (!email || !password) {
        setErrorMessage("Please fill in all the fields!");
        return;
      }
      var token = "123";
      if (localStorage.getItem("token")) {
        token = localStorage.getItem("token");
      }

      setErrorMessage("");
      const userData = { email, password, rememberMe };
      const options = {
        method: "POST",
        url: "http://172.16.85.51:8000/api/auth/login",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: userData,
      };

      try {
        const response = await axios.request(options);
        // const userId = response.data.user.userId;
        console.log("DATA", response.data);
        const token = response.data.access_token;

        localStorage.setItem("refresh_token", response.data.refresh_token); // Store token
        localStorage.setItem("token", token); // Store token

        console.log("Logged in successfully");

        if (role === "admin") {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard/user");
        }

        // Once logged in, call the getUserData() to check the role
        getUserData();
      } catch (error) {
        console.error(
          "Error logging in:",
          error.message ? error.response.data : error.message
        );
        setErrorMessage("Failed to log in.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md w-96 flex flex-col justify-center items-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{ color: "#1F2937" }}
      >
        Sign in
      </h2>
      <form onSubmit={handleLogin} className="w-full">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-2"
          style={{ borderColor: "#E5E7EB" }}
        />
        <div className="relative mt-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            style={{ borderColor: "#E5E7EB" }}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-sm cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            style={{ color: "#3B82F6" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errorMessage && (
          <p className="text-sm mt-2" style={{ color: "#EF4444" }}>
            {errorMessage}
          </p>
        )}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2 cursor-pointer"
          />
          <label htmlFor="rememberMe" style={{ color: "#1F2937" }}>
            Remember me
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded mt-4 cursor-pointer active:scale-95 transition-all duration-200"
          style={{
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
        >
          Log in
        </button>
      </form>
      <div className="mt-3" style={{ color: "#3B82F6" }}>
        Dont have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{
            color: "#3B82F6",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#2563EB")}
          onMouseOut={(e) => (e.target.style.color = "#3B82F6")}
        >
          Sign up
        </span>
      </div>
      <div className="mt-3" style={{ color: "#3B82F6" }}>
        <span
          onClick={handleForgotPassword}
          style={{
            color: "#3B82F6",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.color = "#2563EB";
          }}
          onMouseOut={(e) => {
            e.target.style.color = "#3B82F6";
          }}
        >
          Forgot Password?
        </span>
      </div>
    </div>
  );
}

export default Login;
