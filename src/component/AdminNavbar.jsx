import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="p-4 shadow-md"
      style={{
        backgroundColor: "#E8E6E6",
        paddingTop: "30px",
        paddingBottom: "30px",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold" style={{ color: "#8B4513" }}>
          <Link to="/dashboard">Admin Dashboard</Link>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/dashboard"
            className="hover:text-gray-300 font-semibold"
            style={{ color: "#8B4513", cursor: "pointer" }}
          >
            Dashboard
          </Link>
          <Link
            to="/permissions"
            className="hover:text-gray-300 font-semibold"
            style={{ color: "#8B4513", cursor: "pointer" }}
          >
            Permissions
          </Link>
          <button
            onClick={() => localStorage.clear()} // Clear local storage and logout
            className="hover:text-gray-300 font-semibold"
            style={{ color: "#8B4513", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
