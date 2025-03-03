import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { useRef } from 'react';
const UpdatePermission = ({setShowUpdatePermission, permissionData  }) => {

    const permissionNameRef = useRef(null);
    const descriptionRef = useRef(null);
    const [formData, setFormData] = useState({
        permissionName: permissionData.permissionName || "", 
        description: permissionData.description || ""
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    async function handleSubmit (){
        const newData = {
          permissionName: permissionNameRef.current.value,
          description: descriptionRef.current.value,
        };
        setFormData(newData);
        console.log("Submitted Data:", newData);
        console.log("Form Data:", formData);
        const token = localStorage.getItem("token");
        
        const options = {
            method: 'POST',
            url: 'http://172.16.85.51:8000/api/editPermission',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: {permissionId: permissionData.permissionId, permissionName: newData.permissionName, description: newData.description}
        };
          
          try {
            const { data } = await axios.request(options);
            console.log(data);
            window.location.reload();
          } catch (error) {
            console.error(error);
          }
        // You can replace this with API submission logic
        // createPermission();
        setShowUpdatePermission(false); // Close modal
      };
        
        
        return (
            <div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
            style={{
            //   opacity: showPermissionModal ? 1 : 0,
            //   pointerEvents: showPermissionModal? "all" : "none",
              transition: "opacity 0.5s ease, pointer-events 0.5s ease",
            }}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-500 ease-in-out"
              style={{
                // opacity: showPermissionModal ? 1 : 0,
                // transform: showPermissionModal ? "scale(1)" : "scale(0.95)",
                transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
              }}
            >
              <h3 className="text-lg font-semibold mb-4 ">Update Permission</h3>
              <div>
                <div className='text-left text-lg font-normal'>
                Permission Name
                </div>
                
                <input type="text"           
              placeholder="Enter permission name"
            name="permissionName" 
            id="permissionName" 
            onChange={handleChange}

            value={formData.permissionName}
            className='border border-b h-12 w-full mb-4 shadow-sm rounded p-4 text-lg uppercase'
            
            ref={permissionNameRef} />
              </div>
              
              <div>
                <div className='text-left text-lg font-normal'>
                Description
                </div>
                
                <input type="text"           
              placeholder="Enter Description"
              value={formData.description}
            name="description" 
            id="description" 
            onChange={handleChange}

            className='border border-b h-12 w-full mb-4 shadow-sm rounded p-4 text-lg uppercase'
            ref={descriptionRef} />
              </div>
    
              
    
        
              <div className="flex justify-between">
                <button
                  onClick={handleSubmit}
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
                  Update
                </button>
                <button
                  onClick={() =>   setShowUpdatePermission(false)}
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

export default UpdatePermission
