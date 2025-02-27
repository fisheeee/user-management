import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function ResetPasswordForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const url = new URL(window.location.href);

  // Extract the token query parameter
  const token = url.searchParams.get("token");
  async function hitResetPasswordApi() {
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/reset-password",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer 123",
      },
      data: {
        email: email,
        password: password,
        token: token,
        password_confirmation: confirmPassword,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);

      Swal.fire({
        title: "Password Reset Successfully!",
        text: "You have successfully reset your password. Please log in.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to reset password.");
    }
  }
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all the fields.");
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
    } else {
      hitResetPasswordApi();
      setErrorMessage("");
      //   navigate("/login");
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
        Reset password
      </h2>
      <form onSubmit={handlePasswordReset}>
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
          Reset
        </button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
