import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import User from "./pages/User";
import Dashboard from "./pages/Dashboard";
import Notification from "./pages/Notification";
import Monitoring from "./pages/Monitoring";
import DeviceDetails from "./pages/DeviceDetails";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import Devices from "./pages/Devices";
import AuthCallBack from "./components/Auth/AuthCallBack";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/callback" element={<AuthCallBack />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/*" element={<User />}>
            <Route path="devices" element={<Devices />} />
            <Route path="devicesdetails" element={<DeviceDetails />} />
            <Route path="notification" element={<Notification />} />
          </Route>
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/devices/:id" element={<DeviceDetails />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
