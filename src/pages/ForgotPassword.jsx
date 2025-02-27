import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://172.16.85.51:8000/api/reset-email",
        { email }
      );
      Swal.fire({
        title: "Success!",
        text: "Password reset link has been sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to send reset email.");

      Swal.fire({
        title: "Error!",
        text: "Failed to send reset email. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    console.log("email", email);
    const data = { email: email };
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/reset-email",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer 123",
      },
      data,
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
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
        Forgot Password
      </h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 border rounded mt-2"
          style={{ borderColor: "#E5E7EB" }}
        />
        <button
          type="submit"
          className="w-full py-2 rounded mt-4 cursor-pointer active:scale-95 transition-all duration-200"
          style={{ backgroundColor: "#3B82F6", color: "#FFFFFF" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
          onMouseOut={(e) => (e.target.stylee.backgroundColor = "#3B82F6")}
        >
          Request reset link
        </button>
      </form>
      {message && (
        <p className="text-sm mt-2" style={{ color: "#EF4444" }}>
          {message}
        </p>
      )}
      <div className="mt-4">
        <button
          onClick={() => navigate("/login")}
          style={{
            color: "#3B82F6",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#2563EB")}
          onMouseOut={(e) => (e.target.style.color = "#3B82F6")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
