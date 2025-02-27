import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function hitRegisterApi() {
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/auth/register",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer 123",
      },
      data: {
        name,
        email,
        password,
        password_confirmation: password,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);

      Swal.fire({
        title: "Registered Successfully!",
        text: "You have successfully registered. Please log in.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        setErrorMessage(
          error.response.data.message || "An error occured during registration."
        );
      } else {
        setErrorMessage("An error occured during registration.");
      }
    }
  }
  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all the fields!");
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      hitRegisterApi();
      setErrorMessage("");
      navigate("/login");
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md w-96"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <h2
        className="text-2xl text-font-bold mb-4 text-center"
        style={{ color: "#1F2937" }}
      >
        Create an account
      </h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mt-4"
          style={{ borderColor: "#E5E7EB" }}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-4"
          style={{ borderColor: "#E5E7EB" }}
        />
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mt-4"
          style={{ borderColor: "#E5E7EB" }}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded mt-4"
          style={{ borderColor: "#E5E7EB" }}
        />
        {errorMessage && (
          <p className="text-sm mt-2" style={{ color: "#EF4444" }}>
            {errorMessage}
          </p>
        )}
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
          Sign up
        </button>
      </form>
      <div className="mt-3" style={{ color: "#3B82F6" }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{
            color: "#3B82F6",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#2563EB")}
          onMouseOut={(e) => (e.target.style.color = "#3B82F6")}
        >
          Sign in
        </span>
      </div>
    </div>
  );
}

export default Register;
