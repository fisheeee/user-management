import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CreatePermission from "../component/CreatePermission.jsx";
import UpdatePermission from "../component/UpdatePermission.jsx";
import DeletePermission from "../component/DeletePermission.jsx";
import AssignPermission from "../component/AssignPermission.jsx";
const Permissions = () => {
  const [adminData, setAdminData] = useState(null);
  const [roles, setRoles] = useState([]);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showCreatePermission, setShowCreatePermission] = useState(false);
  const [showUpdatePermission, setShowUpdatePermission] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showDeletePermission, setShowDeletePermission] = useState(false);
  const [showAssignPermission, setShowAssignPermission] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [permissions,setPermissions] = useState([]);
  const [allPermissions,setAllPermissions] = useState([]);
  const handleUpdateClick = (permission) => {
    setSelectedPermission(permission); // Store clicked permission
    setShowUpdatePermission(true); // Show modal
  };
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
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.clear();
      navigate("/login");
    }
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
      console.log("ADMINDATA", data.payload);
      setAdminData(data.payload);
      if (data.payload.role != "admin") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error getting admin data:", error);
    }
  }

  async function getRoles() {
    const options = {
      method: "GET",
      url: "http://172.16.85.51:8000/api/getAllRoles",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data.roles);
      setRoles(data.roles);
    } catch (error) {
      console.error(error);
    }
  }

  async function getPermissions(roleId) {
    const options = {
      method: "POST",
      url: "http://172.16.85.51:8000/api/getPermissionById",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: { roleId },
    };

    try {
      const { data } = await axios.request(options);
      // setPermissions((prev) => ({
      //   ...prev,
      //   [roleId]: data.permissions, // Store permissions under the corresponding roleId
      // }));
      setPermissions((prev) => ({
        ...prev,
        [roleId]: data.permissions, // Store permissions under roleId
      }));      // setPermissions(data.permissions);
      // console.log(data.permissions);
      // console.log("permission",JSON.parse(localStorage.getItem("permissions")));
    } catch (error) {
      console.error(error);
    }
  }

async function getAllPermissions(){
  const options = {
    method: 'GET',
    url: 'http://172.16.85.51:8000/api/getPermissions',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    }
  };
  
  try {
    const { data } = await axios.request(options);
    setAllPermissions(data.permissions);
    console.log("ALLPERMISS",data.permissions);
  } catch (error) {
    console.error(error);
  }
}

async function handleUnassignPermission(roleId, permissionId) {
  console.log("UNASSIGN",roleId,permissionId);
  const options = {
    method: 'POST',
    url: 'http://172.16.85.51:8000/api/unassignPermission',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: { roleId, permissionId }
  };
  
  try {
    const { data } = await axios.request(options);
    console.log(data);
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}
useEffect(() => {
  if (adminData && !adminData.role.includes("admin")) {
    console.log("YOU ARE NOT ADMIN", adminData.role);
    navigate("/login"); // Redirect to login if not an admin
  } 
}, [adminData, navigate]);

useEffect(() => {
  getAdminData(); // Call getAdminData to set the admin data
}, [token]);

  useEffect(() => {
    getAllPermissions();
    getRoles();
  

  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      roles.forEach((role) => getPermissions(role.roleId));
    }
  }, [roles]);
  // console.log("constant",permissions)
  return (
    <div className="p-6 rounded-lg shadow-md w-full text-center">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>
        Permissions Page
      </h2>
      <p className="text-lg font-semibold" style={{ color: "#1F2937" }}>
        Only accessible by Admin
      </p>

   

      <table className="table-auto w-full text-sm text-left font-bold uppercase border rounded-md">
        <thead className="border-b">
          <tr className="border-b">
            <th className="w-44 border-b border p-4 text-2xl font-bold bg-amber-200">Role</th>
            <th className="w-2/4 border-b border p-4 text-2xl font-bold bg-amber-200">Permissions</th>
            <th className="w-44 border-b border p-4 text-2xl font-bold bg-amber-200">Actions</th>
          </tr>
        </thead> 
        <tbody className="border-b border">
        {roles.map((role) => (
  <tr key={role.roleId} className="border-b">
    <td className="border-b w-44 border p-4 text-4xl">{role.roleName}</td>
    <td className="border-b w-2/4 border p-4">
      <div className="flex flex-row flex-wrap gap-4 justify-center text-center items-center">
      {(permissions[role.roleId] || []).map((permission, index) => (
  <div key={`${role.roleId}-${index}`} className="inline-block">
 <button
  type="button"
  onClick={() => handleUpdateClick(permission[0])} 
  className="p-3 cursor-pointer hover:bg-blue-400 bg-blue-200 rounded outline-1 shadow w-60 h-12 text-center uppercase font-bold flex items-center justify-center relative group"
>
  {/* X Icon - Left Aligned */}
  <img
    src="/close.png"
    alt="Remove"
    className="w-4 h-4 absolute left-3 cursor-pointer hover:text-black"
    onClick={(event) => {
      event.stopPropagation(); // Stop event bubbling
      handleUnassignPermission(role.roleId, permission[0].permissionId);
    }}
  />

  {/* Centered Text */}
  <span className="mx-auto text-center">{permission[0].permissionName}</span>
</button>

    {/* Show UpdatePermission component when clicked */}
    {showUpdatePermission && selectedPermission && (
      <UpdatePermission 
        setShowUpdatePermission={setShowUpdatePermission} 
        permissionData={selectedPermission}
        />
    )}
  </div>
))}

        
      </div>
    </td>
    <td className=" p-4 flex flex-wrap flex-row gap-4 justify-center items-center h-full">
      
  <button type="button " className="cursor-pointer bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-20 h-12 text-center"  onClick={() => {
                          setShowAssignPermission(!showAssignPermission);
                         
                        }}>
                          {showAssignPermission ? "Close" : "Assign"}
                        </button>
                        {showAssignPermission && <AssignPermission setShowAssignPermission={setShowAssignPermission}/>}
        
        <button type="button" 
        onClick={() => setShowCreatePermission(!showCreatePermission)}
        className="cursor-pointer bg-green-400 hover:green-700 text-white font-bold py-2 px-4 rounded w-20 h-12 text-center"          >
          {showCreatePermission ? "Close" : "Create"}
          </button>
          {showCreatePermission && <CreatePermission setShowCreatePermission={setShowCreatePermission}/>}

          <button type="button" 
        onClick={() => setShowDeletePermission(!showDeletePermission)}
        className="cursor-pointer bg-red-500 hover:red-700 text-white font-bold py-2 px-4 rounded w-20 h-12 text-center"          >
          {showDeletePermission ? "Close" : "Delete"}
          </button>
          {showDeletePermission && <DeletePermission setShowDeletePermission={setShowDeletePermission}/>}

          

        


        </td>
  </tr>
))}
       
        </tbody>
      </table>

   
      <div className="relative">
  <select className="p-2 border rounded">
    <option value="">TEST</option>
    <option value="">TST2</option>
  </select>
</div>
    </div>
  );
};

export default Permissions;
