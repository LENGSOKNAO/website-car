import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
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
import Orders from "@/pages/Orders";
import Messages from "@/pages/Messages";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";

export default function App() {
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    api
      .users()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        setSellers(
          list.filter((u: any) => {
            const roleName = (u.role || u.type || "").toLowerCase();
            const hasRole = u.roles?.some(
              (r: any) =>
                (typeof r === "string" ? r : r.name || "").toLowerCase() ===
                "seller",
            );
            return (
              roleName === "seller" ||
              roleName === "dealer" ||
              u.is_dealer ||
              hasRole
            );
          }),
        );
      })
      .catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            {sellers.map((seller) => (
              <Route
                key={seller.id}
                path={`/${seller.full_name.toLowerCase()}`}
                element={<BrandPage />}
              />
            ))}
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
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/seller/admin" element={<SellerAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/listings/:id" element={<ListingDetail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
