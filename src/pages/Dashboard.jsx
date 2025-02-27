import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../AxiosInstance";
import axios from "axios";
import Swal from "sweetalert2";

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null); // Store the base64 image here
  const [showSettings, setShowSettings] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [errorMessage, setErrorMessage] = useState("");
  const [recentActivities, setRecentActivities] = useState([]);
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const [previousUserData, setPreviousUserData] = useState({
    userName: "",
    email: "",
  });

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  function isTokenExpired(token) {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  }

  // useEffect that calls getUserData only once when the component mounts
  useEffect(() => {
    if (isTokenExpired(token)) {
      // navigate("/login");
      refreshToken();
      // getUserData();
    } else {
      if (userId) {
        getUserData();
        getImage();
      }
    }
  }, [userId, token, navigate]); // Empty dependency array, only runs once when userId is available

  // Fetch user data
  async function getUserData() {
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
      setUserData(data.payload); // Set the user data only once
      console.log("data", userData);

      setPreviousUserData({
        userName: data.payload.userName,
        email: data.payload.email,
      });
    } catch (error) {
      console.error(error);
    }
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
      console.log("Access token refreshed successfully", newAccessToken);
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.clear();
      navigate("/login");
    }
  }

  async function editProfile() {
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/editProfile",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: {
        userName: userData.userName,
        userId: userId,
        email: userData.email,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);

      setUserData({
        ...userData,
        userName: userData.userName,
        email: userData.email,
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch profile image
  async function getImage() {
    const options = {
      method: "GET",
      url: "http://172.16.85.51:8000/api/getImage",
      params: { userId: userId },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log("picture data", data);
      setProfilePicture(`data:image/*;base64,${data}`); // Set base64 image data in the state
    } catch (error) {
      console.error(error);
    }
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
      const { data } = await axiosInstance.request(options);
      console.log(data);
      localStorage.clear();
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      console.log("No file selected.");
      return; // Exit if no file is selected.
    }

    // Proceed if a file is selected
    setFileName(file.name); // Set the file name to display
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;
      setProfilePicture(base64Image); // Set the base64 image as the profile picture
      localStorage.setItem("profile-picture", base64Image); // Store in localStorage
    };

    handleUploadImage(file, userId, token);
    console.log("filename", file.name);
    reader.readAsDataURL(file); // Read the selected file as base64 string
  };

  // Handle image upload to the server
  async function handleUploadImage(image, userId, token) {
    const form = new FormData();
    form.append("image", image);
    form.append("userId", userId);

    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/uploadImage",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      const { data } = await axiosInstance.request(options);
      console.log(data);
      if (data.success) {
        localStorage.setItem("profile-picture", data.imageUrl);
        setProfilePicture(data.imageUrl);
      }
    } catch (error) {
      console.error(error);
      if (error.response.status === 500) {
        alert("Error uploading image. Please try again later.");
      }
    }
  }

  // Save settings
  const handleSaveSettings = async () => {
    if (!userData?.userName || !userData?.email) {
      setErrorMessage("Please fill in both username and email.");
      return;
    }

    setErrorMessage("");

    const updatedActivities = [...recentActivities];
    let changesMade = false;

    if (userData?.userName !== previousUserData?.userName) {
      updatedActivities.push("Updated username successfully");
      changesMade = true;
    }
    if (userData?.email !== previousUserData?.email) {
      updatedActivities.push("Changed email address");
      changesMade = true;
    }

    setRecentActivities(updatedActivities);

    if (!changesMade) {
      Swal.fire({
        title: "No Changes",
        text: "No changes were made to your profile.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await editProfile();
      Swal.fire({
        title: "Success!",
        text: "Settings saved successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setShowSettings(false);
      setPreviousUserData({
        userName: userData?.userName,
        email: userData?.email,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save settings. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCloseModal = () => {
    setShowSettings(false);
  };
  console.log("user", userData);

  const handleClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div
      className="app flex justify-center bg-amber-50 h-screen items-center"
      // style={{ backgroundColor: "#F7F7F7" }}
    >
      <div className="relative">
        <div
          className="p-6 rounded-lg shadow-md w-96 text-center"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="flex flex-col items-center mb-4">
            <img
              id="profile-picture" // Using the id here to target it
              src={profilePicture || "/default-avatar.jpg"} // Use the profilePicture state here
              className="w-32 h-32 rounded-full border-4 border-gray-300 mb-2"
            />

            <button
              type="button"
              onClick={handleClick}
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                padding: "3px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {fileName}
            </button>

            {/* Custom File Input */}
            {/* <label htmlFor="profile-picture" style={{ cursor: "pointer" }}>
            {fileName}
          </label> */}

            {/* Hidden File Input */}
            <input
              id="file-input"
              type="file"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }} // Hide the default file input
              accept="image/*"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>
            {getGreeting()}, {userData?.userName || "User"}
          </h2>
          <div className="mb-6">
            <p className="text-lg font-semibold" style={{ color: "#1F2937" }}>
              Hello, {userData?.userName || "User"}!
            </p>
            <p className="text-sm" style={{ color: "#4B5563" }}>
              {userData?.email || "Email not available"}
            </p>
          </div>
          <div className="mb-6 text-left">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#1F2937" }}
            >
              Recent Activities
            </h3>
            <ul className="list-disc pl-5 text-sm" style={{ color: "#4B5563" }}>
              {recentActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 rounded cursor-pointer active:scale-95 transition-all duration-200"
              style={{
                backgroundColor: "#3B82F6",
                color: "#FFFFFF",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
            >
              Change Settings
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded cursor-pointer active:scale-95 transition-all duration-200"
            style={{
              backgroundColor: "#F87171",
              color: "#FFFFFF",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#EF4444")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#DC2626")}
          >
            Logout
          </button>
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Update Your Settings
              </h3>
              {errorMessage && (
                <p className="text-sm mb-4" style={{ color: "#EF4444" }}>
                  {errorMessage}
                </p>
              )}
              <div className="mb-4">
                <label
                  className="block text-sm font-semibold"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={userData?.userName || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, userName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={userData?.email || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 rounded active:scale-95 transition-all duration-200"
                  style={{
                    backgroundColor: "#3B82F6",
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#2563EB")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#3B82F6")
                  }
                >
                  Save Settings
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded active:scale-95 transition-all duration-200 font-semibold"
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
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
