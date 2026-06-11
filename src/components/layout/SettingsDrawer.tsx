import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Shield,
  Bell,
  Palette,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import Avatar from "@/components/ui/Avatar";

const links = [
  { label: "My Profile", icon: User, path: "/profile" },
  { label: "Orders", icon: ClipboardList, path: "/orders" },
  { label: "Wishlist", icon: Heart, path: "/wishlist" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
  { label: "Bag", icon: ShoppingBag, path: "/cart" },
];

export default function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => go("/profile")} className="flex items-center gap-3 w-full text-left group">
                <Avatar name={user?.full_name || "U"} src={user?.avatar_url} size="sm" className="w-10 h-10 ring-2 ring-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3">
              <div className="space-y-0.5">
                {links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => go(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left group"
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Preferences</p>
                <div className="space-y-0.5">
                  {[
                    { icon: Shield, label: "Security" },
                    { icon: Bell, label: "Notifications" },
                    { icon: Palette, label: "Appearance" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => go("/profile")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left group"
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-3 py-3 border-t border-gray-100">
              <button
                onClick={() => { onClose(); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors group"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
