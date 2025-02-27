import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Permissions = () => {
  const [adminData, setAdminData] = useState(null);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function isTokenExpired(token) {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  async function getAdminData() {
    if (isTokenExpired(token)) {
      const newToken = await refreshToken();
      if (!newToken) return;
    }

    const options = {
      method: "GET",
      url: "http://172.16.85.51:8000/api/auth/me",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      setAdminData(data.payload);
      if(data.payload.role !== "admin"){
        navigate("/dashboard");
      }
      console.log(data);
    } catch (error) {
      console.error("Error getting admin data:", error);
    }
  }

  async function getUsers(){
    
  }

  async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/auth/refreshJWT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      const newAccessToken = data.access_token;
      localStorage.setItem("token", newAccessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.clear();
      navigate("/login");
    }
  }

  useEffect(() => {
    if (adminData && !adminData.role.includes("admin")) {
      console.log("YOU ARE NOT ADMIN", adminData.role);
      navigate("/dashboard"); // Redirect to login if not an admin
    }
  }, [adminData, navigate]);

  return (
    <div className="p-6 rounded-lg shadow-md w-full text-center">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>
        Permissions Page
      </h2>
      <p className="text-lg font-semibold" style={{ color: "#1F2937" }}>
        Only accessible by Admin
      </p>
    </div>
  );
};

export default Permissions;
