// /src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookService />} />
        <Route path="/providers" element={<ProviderListings />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/dashboard/homeowner" element={<HomeownerDashboard />} />
        <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/auth" element={<LoginRegister />} />
        <Route path="/review/:bookingId" element={<SubmitReview />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
