import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isListingDetail = /^\/listings\/[^/]+$/.test(pathname);
  const isMessagesPage =
    pathname.startsWith("/messages") ||
    pathname.startsWith("/seller/messages") ||
    isListingDetail;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      {!isMessagesPage && <Footer />}
    </div>
  );
}
