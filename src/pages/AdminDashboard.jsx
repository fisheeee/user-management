import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../AxiosInstance";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [users, setUsers] = useState([]);
  const [roleToAdd, setRoleToAdd] = useState("");
  const [userIdToAssignRole, setUserIdToAssignRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const token = localStorage.getItem("token");
  const { userId } = useParams();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  // Function to check if token is expired
  function isTokenExpired(token) {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  // Get admin data from the backend
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
      const { data, status } = await axios.request(options);
      if (status === 401) {
        refreshToken();
      }
      setAdminData(data.payload); // Set the user data
    } catch (error) {
      console.error("Error getting admin data", error);
    }
  }

  // Refresh token if expired
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

  // Check if the user is an admin
  useEffect(() => {
    if (adminData && !adminData.role.includes("admin")) {
      console.log("YOU ARE NOT ADMIN", adminData.role);
      // navigate("/login"); // Redirect to login if not an admin
    } else {
      handleGetAllUser(); // Fetch users if admin
    }
  }, [adminData, navigate]);

  // Fetch all users (admin only)
  async function handleGetAllUser() {
    const options = {
      method: "GET",
      url: "http://172.16.85.51:8000/api/getAllUser",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data.users);
      setUsers(data.users); // Set users data
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  }

  async function handleAddRole() {
    console.log(`Role to add: ${roleToAdd}, User ID: ${userIdToAssignRole}`);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userIdToAssignRole ? { ...user, role: roleToAdd } : user
      )
    );
    setShowRoleModal(false);

    Swal.fire({
      title: "Success!",
      text: `Role ${roleToAdd} has been successfully assigned!`,
      icon: "success",
      confirmButtonText: "OK",
    });
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/assignRole",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { userId: userIdToAssignRole, roleId: roleToAdd },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRemoveUser(id) {
    console.log(id);

    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/deleteUser",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { userId: id },
    };

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .request(options)
          .then(() => {
            handleGetAllUser();
            Swal.fire("Deleted!", "User has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting user:", error.response);
            Swal.fire(
              "Error!",
              "There was an issue deleting the user",
              "error"
            );
          });
      }
    });
  }

  // Handle logout
  async function handleLogout() {
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/auth/logout",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axiosInstance.request(options);
      localStorage.clear();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Fetch admin data when component mounts
  useEffect(() => {
    getAdminData(); // Call getAdminData to set the admin data
  }, [token]);

  // Log adminData after it's updated
  useEffect(() => {
    if (adminData) {
      console.log("Admin data updated:", adminData); // Log when adminData changes
    }
  }, [adminData]);

  return (
    <div
      className="app flex justify-center bg-amber-50 h-screen items-center"
      // style={{ backgroundColor: "#F7F7F7" }}
    >
      <div
        className="p-6 rounded-lg shadow-md w-full text-center"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>
          {getGreeting()}, Admin
        </h2>
        <div className="mb-6">
          <p className="text-lg font-semibold" style={{ color: "#1F2937" }}>
            Admin Controls
          </p>
          <p className="text-sm" style={{ color: "#4B5563" }}>
            Manage the users, settings, and other admin specific controls here.
          </p>
        </div>

        <div className="my-4">
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "#1F2937" }}
          >
            Registered Users
          </h3>

          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-gray-700">User ID</th>
                  <th className="px-4 py-2 text-gray-700">Username</th>
                  <th className="px-4 py-2 text-gray-700">Email</th>
                  <th className="px-4 py-2 text-gray-700">Role</th>
                  <th className="px-4 py-2 text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user.email} className="border-b">
                    <td className="px-4 py-2">{user.userId}</td>
                    <td className="px-4 py-2">{user.userName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    {/* <td className="px-4 py-2">{user.role}</td> */}
                    <td className="px-4 py-2">
                      <select
                        // onClick={() => handleRemoveUser(user.userId)}
                        value={user.role}
                        className="mr-2"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setUserIdToAssignRole(user.userId);
                          setShowRoleModal(true);
                        }}
                        className="text-blue-500 font-semibold mr-2"
                        style={{ cursor: "pointer" }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user.userId)}
                        className="text-red-500 font-semibold"
                        style={{ cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showRoleModal && (
          <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
            style={{
              opacity: showRoleModal ? 1 : 0,
              pointerEvents: showRoleModal ? "all" : "none",
              transition: "opacity 0.5s ease, pointer-events 0.5s ease",
            }}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-500 ease-in-out"
              style={{
                opacity: showRoleModal ? 1 : 0,
                transform: showRoleModal ? "scale(1)" : "scale(0.95)",
                transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Assign Role</h3>
              <select
                value={roleToAdd}
                onChange={(e) => setRoleToAdd(e.target.value)} // Updates role selection
                className="mb-2"
                style={{ cursor: "pointer" }}
              >
                <option value="2">User</option>
                <option value="1">Admin</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handleAddRole}
                  className="px-4 py-2 rounded active:scale-95 transition-all duration-200 font-semibold"
                  style={{
                    backgroundColor: "#22C55E",
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#16A34A")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#22C55E")
                  }
                >
                  Assign Role
                </button>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded cursor-pointer active:scale-95 transition-all duration-200 font-semibold"
                  style={{
                    backgroundColor: "#F87171",
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#EF4444")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#DC2626")
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded cursor-pointer active:scale-95 transition-all duration-200"
            style={{ backgroundColor: "#F87171", color: "#FFFFFF" }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#EF4444")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#DC2626")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
