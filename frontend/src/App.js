// /src/App.js
import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import socket from "./socket";

// Pages
import Home from "./pages/Home";
import BookService from "./pages/BookService";
import ProviderListings from "./pages/ProviderListings";
import ProviderProfile from "./pages/ProviderProfile";
import HomeownerDashboard from "./pages/HomeownerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminPanel from "./pages/AdminPanel";
import LoginRegister from "./pages/LoginRegister";
import SubmitReview from "./pages/SubmitReview";
import PrivateRoute from "./routes/PrivateRoute";
import OrdersPage from "./pages/OrdersPage";
import ProcessOrderPage from "./pages/ProcessOrderPage";
import { AuthContext } from "./context/AuthContext";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import AdminDashboard from "./pages/AdminDashboard";
import HomeownerProfile from "./pages/HomeownerProfile";
import ProviderDetails from "./pages/ProviderDetails"

function AppContent() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const hideHeaderFooter = ["/super-admin"];

  useEffect(() => {
    if (!user) return;

    socket.connect();

    switch (user.role) {
      case "provider":
        socket.emit("registerProvider", user.id);
        break;
      case "homeowner":
        socket.emit("registerHomeowner", user.id);
        break;
      case "admin":
        navigate("/super-admin");
        break;
      default:
        break;
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  


  return (
    <>
      {!hideHeaderFooter.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/super-admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<PrivateRoute><BookService /></PrivateRoute>} />
        <Route path="/providers" element={<PrivateRoute><ProviderListings /></PrivateRoute>} />
        <Route path="/provider/:id" element={<PrivateRoute><ProviderProfile /></PrivateRoute>} />
        <Route path="/provider-details/:id" element={<PrivateRoute><ProviderDetails /></PrivateRoute>} />
        <Route path="/dashboard/homeowner" element={<PrivateRoute><HomeownerDashboard /></PrivateRoute>} />
        <Route path="/homeowner/profile" element={<PrivateRoute><HomeownerProfile /></PrivateRoute>} />
        <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/bookings/:bookingId" element={<PrivateRoute><BookingDetails /></PrivateRoute>} />
        <Route path="/dashboard/provider" element={<PrivateRoute><ProviderDashboard /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><ProviderProfile /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/dashboard/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/orders/:orderId" element={<PrivateRoute><ProcessOrderPage /></PrivateRoute>} />
        <Route path="/review/:bookingId" element={<PrivateRoute><SubmitReview /></PrivateRoute>} />
      </Routes>

      {!hideHeaderFooter.includes(location.pathname) && <Footer />}

  
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
