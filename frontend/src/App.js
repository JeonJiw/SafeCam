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
import Monitoring from "./pages/Monitoring";
import ViewStream from "./pages/ViewStream";
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";

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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/view/:id" element={<ViewStream />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
