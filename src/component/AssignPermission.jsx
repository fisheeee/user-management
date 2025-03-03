import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
const AssignPermission = ({setShowAssignPermission}) => {
    const [permissionToAdd, setPermissionToAdd] = useState("");
    const [roleIdToAssignPermission, setroleIdToAssignPermission] = useState(null);
    const [allPermissions,setAllPermissions] = useState([]);
    const token = localStorage.getItem("token");

    async function handleAddPermission() {
       
        Swal.fire({
          title: "Success!",
          text: `Permission ${permissionToAdd} has been successfully assigned!`,
          icon: "success",
          confirmButtonText: "OK",
        });
        const options = {
          method: 'POST',
          url: 'http://172.16.85.51:8000/api/assignPermissions',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: {roleId: roleIdToAssignPermission, permissionId: permissionToAdd}
        };
        
        try {
          const { data } = await axios.request(options);
          console.log(data);
          window.location.reload();
    
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

      useEffect(() => {
        getAllPermissions();
        // getRoles();
      
    
      }, []);
      console.log("ALLPERMS2",allPermissions);
  return (
    <div
    className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
    style={{

      transition: "opacity 0.5s ease, pointer-events 0.5s ease",
    }}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-500 ease-in-out"
      style={{
   
        transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
      }}
    >
      <h3 className="text-lg font-semibold mb-4">Assign Permission</h3>
      
      <select
        value={permissionToAdd}
        onChange={(e) => setPermissionToAdd(e.target.value)} // Updates role selection
        onClick={(e) => console.log('Dropdown clicked!')}

        className="mb-4 p-2 border rounded w-full font-bold text-xl uppercase"
        style={{ cursor: "pointer" }}
      >
        {allPermissions.map((permission) => (
          <option key={permission.permissionId} value={permission.permissionId } className="font-bold bg-amber-400">
            {permission.permissionName}
          </option>
        ))};
        
      </select>
      <div className="flex justify-between">
        <button
          onClick={handleAddPermission}
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
          Assign 
        </button>
        <button
          onClick={() => setShowAssignPermission(false)}
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
  )
}

export default AssignPermission
