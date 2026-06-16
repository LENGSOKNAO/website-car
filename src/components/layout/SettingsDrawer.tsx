import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  MessageSquare,
  ClipboardList,
  LogOut,
  ChevronRight,
  X,
  Store,
  Car,
  Layout,
  Image,
  BarChart3,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import Avatar from "@/components/ui/Avatar";

const buyerLinks = [
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Orders", icon: ClipboardList, path: "/orders" },
  { label: "Wishlist", icon: Heart, path: "/wishlist" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
];

const sellerLinks = [
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "My Listings", icon: Car, path: "/seller/listings" },
  { label: "My Sales", icon: ClipboardList, path: "/seller/sales" },
  { label: "Messages", icon: MessageSquare, path: "/seller/messages" },
  { label: "Banner", icon: Image, path: "/seller/banner" },
  { label: "Heroes", icon: Layout, path: "/seller/heroes" },
];

const adminLinks = [
  { label: "Dashboard", icon: BarChart3, path: "/admin" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Sellers", icon: Store, path: "/admin/sellers" },
  { label: "All Listings", icon: Car, path: "/admin/listings" },
];

export default function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getUserRole = (u: typeof user) => {
    if (!u) return "buyer";
    const roleStr = (u.role || "").toLowerCase();
    const roleArr =
      u.roles?.map((r: any) =>
        typeof r === "string" ? r.toLowerCase() : (r.name || "").toLowerCase(),
      ) ?? [];
    if (roleStr === "admin" || roleArr.includes("admin")) return "admin";
    if (
      roleStr === "seller" ||
      roleStr === "dealer" ||
      u.is_dealer ||
      roleArr.includes("seller") ||
      roleArr.includes("dealer")
    )
      return "seller";
    return "buyer";
  };

  const role = getUserRole(user);
  const isAdmin = role === "admin";
  const isSeller = role === "seller";

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-white shadow-xl flex flex-col"
          >
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Profile
                </span>
                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <button onClick={() => go("/profile")} className="flex items-center gap-2.5 w-full text-left">
                <Avatar
                  name={user?.full_name || "U"}
                  src={user?.avatar_url}
                  size="sm"
                  className="w-8 h-8 ring-2 ring-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-3 space-y-3">
              {isAdmin && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                    Admin
                  </p>
                  <div className="space-y-0.5">
                    {adminLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => go(item.path)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left group"
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {isSeller && (
                <div>
                  {isAdmin && (
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                      Seller
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {sellerLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => go(item.path)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left group"
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {(!isSeller || isAdmin) && (
                <div>
                  {isAdmin && (
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                      Account
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {buyerLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => go(item.path)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left group"
                        >
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 py-2 border-t border-gray-100">
              <button
                onClick={() => { onClose(); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors group"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
