import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Listings from "@/pages/Listings";
import ListingDetail from "@/pages/ListingDetail";
import SearchPage from "@/pages/SearchPage";
import Financing from "@/pages/Financing";
import TradeIn from "@/pages/TradeIn";
import SellCar from "@/pages/SellCar";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import TestDrive from "@/pages/TestDrive";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import BrandPage from "@/pages/BrandPage";
import NotFound from "@/pages/NotFound";
import SellerAdmin from "@/pages/SellerAdmin";
import SellerListings from "@/pages/SellerListings";
import SellerHeroes from "@/pages/SellerHeroes";
import SellerBanner from "@/pages/SellerBanner";
import SellerSales from "@/pages/SellerSales";
import Orders from "@/pages/Orders";
import Messages from "@/pages/Messages";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/brand/:name" element={<BrandPage />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/trade-in" element={<TradeIn />} />
            <Route path="/sell" element={<SellCar />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test-drive" element={<TestDrive />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/seller/messages" element={<Messages />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/seller/admin" element={<SellerAdmin />} />
            <Route path="/seller/listings" element={<SellerListings />} />
            <Route path="/seller/heroes" element={<SellerHeroes />} />
            <Route path="/seller/banner" element={<SellerBanner />} />
            <Route path="/seller/sales" element={<SellerSales />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
