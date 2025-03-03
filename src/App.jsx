import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPasswordForm from "./pages/ResetPasswordForm.jsx";
import Permissions from "./pages/Permissions.jsx";
import Navbar from "./component/AdminNavbar.jsx";
import Footer from "./component/Footer.jsx";
import AssignPermission from "./pages/AssignPermissions.jsx";
import Test from "./pages/test.jsx";
function App() {
  return (
    <Router>
      <Navbar />
      <div
        className="app flex justify-center bg-amber-50 h-screen items-center"
        // style={{ backgroundColor: "#F7F7F7" }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/dashboard/user/:userId" element={<Dashboard />} />
          <Route path="/dashboard/admin/:userId" element={<AdminDashboard />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="*" element={<Login />}></Route>
          <Route path="/permissions/assign" element={<AssignPermission />}></Route>
          <Route path="/test" element={<Test />}></Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
