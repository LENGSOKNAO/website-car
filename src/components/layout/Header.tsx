import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  CircleUser,
  Search,
  User,
  Heart,
  MessageSquare,
  ClipboardList,
  LogOut,
  Store,
  Car,
  Layout,
  Image,
  BarChart3,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { api } from "@/lib/api";
import { cn, imageUrl } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import SettingsDrawer from "@/components/layout/SettingsDrawer";

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

export default function Header() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [heroes, setHeroes] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [openHeroId, setOpenHeroId] = useState<string | null>(null);
  const [openSellerId, setOpenSellerId] = useState<string | null>(null);
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMobileOpen(false);
    setHoveredCat(null);
    setProfileOpen(false);
    setOpenSellerId(null);
    setOpenHeroId(null);
  }, [location]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHoveredCat(null);
        setProfileOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
    api
      .publicHeroes()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        setHeroes(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {});
    api
      .myListings({ per_page: 200 })
      .then((res: any) => {
        const raw =
          res?.data?.data?.data ?? res?.data?.data ?? res?.data ?? res ?? [];
        setListings(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const pathParts = location.pathname.split("/").filter(Boolean);
  const pageSlug =
    pathParts[0] === "brand" && pathParts[1]
      ? decodeURIComponent(pathParts[1]).toLowerCase()
      : decodeURIComponent(pathParts[0] || "").toLowerCase();

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

  const getListing = (id: string) =>
    listings.find((l: any) => String(l.id) === String(id));

  const currentSeller = (() => {
    const fromSlug = sellers.find(
      (s) => s.full_name.toLowerCase() === pageSlug,
    );
    if (fromSlug) return fromSlug;
    if (isSeller && user) return user;
    return null;
  })();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="shrink-0">
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-[#171A20]">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {isSeller && user ? (
                <Link
                  to={`/brand/${encodeURIComponent(user.full_name.toLowerCase())}`}
                  className={cn(
                    "block px-3 py-1.5 text-sm font-medium rounded-[4px] transition-colors",
                    "text-black",
                  )}
                >
                  {user.full_name}
                </Link>
              ) : (
                sellers
                  .filter((s) => s.id !== user?.id)
                  .map((seller) => (
                    <Link
                      key={seller.id}
                      to={`/brand/${encodeURIComponent(seller.full_name.toLowerCase())}`}
                      className={cn(
                        "block px-3 py-1.5 text-sm font-medium rounded-[4px] transition-colors",
                        "text-[#5C5E62] hover:text-black",
                      )}
                    >
                      {seller.full_name}
                    </Link>
                  ))
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/search"
              className="hidden md:block p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms]"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#5C5E62] hover:text-black transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => setProfileOpen(true)}
                  className="hidden md:flex items-center gap-2 p-0.5 rounded-full border-2 border-transparent hover:border-gray-200 transition-all duration-200"
                >
                  <Avatar
                    name={user.full_name || "User"}
                    src={user.avatar_url}
                    size="sm"
                    className="w-8 h-8"
                  />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-50 bg-black/30"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                          type: "spring",
                          damping: 28,
                          stiffness: 260,
                        }}
                        className="fixed top-14 md:top-16 right-0 bottom-0 z-50 w-[300px] bg-white shadow-xl flex flex-col"
                      >
                        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              Profile
                            </span>
                            <button
                              onClick={() => setProfileOpen(false)}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              name={user.full_name || "U"}
                              src={user.avatar_url}
                              size="sm"
                              className="w-8 h-8 ring-2 ring-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {user.full_name || "User"}
                              </p>
                              <p className="text-[11px] text-gray-500 truncate">
                                {user.email || ""}
                              </p>
                            </div>
                          </div>
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
                                      onClick={() => {
                                        setProfileOpen(false);
                                        navigate(item.path);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left group"
                                    >
                                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
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
                                      onClick={() => {
                                        setProfileOpen(false);
                                        navigate(item.path);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left group"
                                    >
                                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
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
                                      onClick={() => {
                                        setProfileOpen(false);
                                        navigate(item.path);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-100 transition-colors text-left group"
                                    >
                                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                                      <span className="font-medium">
                                        {item.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors group"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-00  bg-gray-200 hover:bg-gray-300 rounded-full transition-all duration-200"
              >
                <CircleUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 md:top-16 bg-white z-40 flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
            {isSeller && user ? (
              <>
                <Link
                  to={`/brand/${encodeURIComponent(user.full_name.toLowerCase())}`}
                  className={cn(
                    "block px-3 py-1.5 text-sm font-medium rounded-[4px] transition-colors",
                    "text-black",
                  )}
                >
                  {user.full_name}
                </Link>
                {(() => {
                  const sellerHeroes = heroes
                    .filter((h) => h.seller_id === user.id && h.is_active)
                    .sort((a, b) => a.sort_order - b.sort_order);
                  if (sellerHeroes.length === 0) return null;
                  return (
                    <div className="pl-4 pb-2 space-y-0.5">
                      {sellerHeroes.map((hero) => {
                        const isHeroOpen = openHeroId === hero.id;
                        const items = Array.isArray(hero.subtitle)
                          ? hero.subtitle
                          : [];
                        return (
                          <div key={hero.id}>
                            <button
                              onClick={() =>
                                setOpenHeroId(isHeroOpen ? null : hero.id)
                              }
                              className="block w-full text-left px-4 py-2 text-xs font-semibold text-[#5C5E62] uppercase tracking-wide hover:text-black"
                            >
                              {hero.title}
                            </button>
                            {isHeroOpen && items.length > 0 && (
                              <div className="pl-4 space-y-0.5">
                                {items.map((item: any, i: number) => {
                                  const subTo =
                                    item.link ||
                                    (item.product_id
                                      ? `/listings/${item.product_id}`
                                      : null);
                                  const SubEl = subTo ? Link : "div";
                                  return (
                                    <SubEl
                                      key={i}
                                      {...(subTo ? { to: subTo } : {})}
                                      className="block px-4 py-1.5 text-xs text-[#5C5E62] hover:text-black transition-colors"
                                    >
                                      {item.text}
                                    </SubEl>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            ) : (
              sellers
                .filter((s) => s.id !== user?.id)
                .map((seller) => {
                  const sellerHeroes = heroes
                    .filter((h) => h.seller_id === seller.id && h.is_active)
                    .sort((a, b) => a.sort_order - b.sort_order);
                  return (
                    <div key={seller.id}>
                      <Link
                        to={`/brand/${encodeURIComponent(seller.full_name.toLowerCase())}`}
                        className="block px-4 py-3 text-sm font-medium text-black hover:text-blue-600 transition-colors"
                      >
                        {seller.full_name}
                      </Link>
                      {sellerHeroes.length > 0 && (
                        <div className="pl-4 pb-2 space-y-0.5">
                          {sellerHeroes.map((hero) => {
                            const isHeroOpen = openHeroId === hero.id;
                            const items = Array.isArray(hero.subtitle)
                              ? hero.subtitle
                              : [];
                            return (
                              <div key={hero.id}>
                                <button
                                  onClick={() =>
                                    setOpenHeroId(isHeroOpen ? null : hero.id)
                                  }
                                  className="block w-full text-left px-4 py-2 text-xs font-semibold text-[#5C5E62] uppercase tracking-wide hover:text-black"
                                >
                                  {hero.title}
                                </button>
                                {isHeroOpen && items.length > 0 && (
                                  <div className="pl-4 space-y-0.5">
                                    {items.map((item: any, i: number) => {
                                      const subTo =
                                        item.link ||
                                        (item.product_id
                                          ? `/listings/${item.product_id}`
                                          : null);
                                      const SubEl = subTo ? Link : "div";
                                      return (
                                        <SubEl
                                          key={i}
                                          {...(subTo ? { to: subTo } : {})}
                                          className="block px-4 py-1.5 text-xs text-[#5C5E62] hover:text-black transition-colors"
                                        >
                                          {item.text}
                                        </SubEl>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
          <div className="shrink-0 border-t border-gray-200 px-4 py-2 flex flex-row items-stretch gap-1">
            <Link
              to="/search"
              className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-[#5C5E62] hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Link>
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Avatar
                  name={user.full_name || "User"}
                  src={user.avatar_url}
                  size="sm"
                  className="w-6 h-6"
                />
                <span>Account</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                <CircleUser className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {currentSeller &&
        (() => {
          const sellerHeroes = heroes
            .filter((h) => h.seller_id === currentSeller.id && h.is_active)
            .sort((a, b) => a.sort_order - b.sort_order);
          if (sellerHeroes.length === 0) return null;
          return (
            <div className="hidden md:block border-b border-gray-100 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center h-10">
                {sellerHeroes.map((hero) => {
                  const isHovered = hoveredCat === hero.id;
                  const items = Array.isArray(hero.subtitle)
                    ? hero.subtitle
                    : [];
                  return (
                    <div
                      key={hero.id}
                      className="relative h-full"
                      onMouseEnter={() => {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(
                          () => setHoveredCat(hero.id),
                          200,
                        );
                      }}
                      onMouseLeave={() => {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = setTimeout(
                          () => setHoveredCat(null),
                          150,
                        );
                      }}
                    >
                      <button
                        className={cn(
                          "h-full px-4 text-xs font-medium transition-all tracking-wide relative cursor-pointer",
                          isHovered
                            ? "text-black"
                            : "text-[#5C5E62] hover:text-black",
                        )}
                      >
                        {hero.title}
                        <motion.span
                          initial={false}
                          animate={{ scaleX: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-black rounded-full origin-center"
                        />
                      </button>
                      {isHovered && items.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="fixed left-0 right-0 top-[104px] bg-white border-b border-gray-100 shadow-lg pt-2"
                          onMouseEnter={() => clearTimeout(timeoutRef.current)}
                          onMouseLeave={() => {
                            timeoutRef.current = setTimeout(
                              () => setHoveredCat(null),
                              100,
                            );
                          }}
                        >
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="grid grid-cols-4 gap-2">
                              {items.map((item: any, i: number) => {
                                const listing = item.product_id
                                  ? getListing(item.product_id)
                                  : null;
                                const subTo =
                                  item.link ||
                                  (item.product_id
                                    ? `/listings/${item.product_id}`
                                    : null);
                                const rawImageUrl =
                                  listing?.primary_image?.image_url ||
                                  listing?.image_url ||
                                  null;
                                return subTo ? (
                                  <Link
                                    key={i}
                                    to={subTo}
                                    className="flex flex-col items-center gap-2 p-3 text-xs text-[#5C5E62] hover:text-black transition-colors rounded-sm hover:bg-gray-50"
                                  >
                                    {rawImageUrl ? (
                                      <img
                                        src={imageUrl(rawImageUrl)}
                                        alt=""
                                        className="w-full aspect-[4/3] object-cover rounded-sm"
                                      />
                                    ) : (
                                      <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm flex items-center justify-center">
                                        <Car className="size-6 text-gray-300" />
                                      </div>
                                    )}
                                    <span className="font-medium text-center leading-tight hover:underline">
                                      {listing
                                        ? `${listing.make?.name ?? listing.make ?? ""} ${listing.model?.name ?? listing.model ?? ""}`.trim() ||
                                          listing.title ||
                                          item.text
                                        : item.text}
                                    </span>
                                  </Link>
                                ) : (
                                  <Link
                                    key={i}
                                    to={subTo}
                                    className="flex flex-col items-center gap-2 p-3 text-xs text-[#5C5E62] hover:text-black transition-colors rounded-sm hover:bg-gray-50"
                                  >
                                    {rawImageUrl ? (
                                      <img
                                        src={imageUrl(rawImageUrl)}
                                        alt=""
                                        className="w-full aspect-[4/3] object-cover rounded-sm"
                                      />
                                    ) : (
                                      <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm flex items-center justify-center">
                                        <Car className="size-6 text-gray-300" />
                                      </div>
                                    )}
                                    <span className="font-medium text-center leading-tight hover:underline">
                                      {listing
                                        ? `${listing.make?.name ?? listing.make ?? ""} ${listing.model?.name ?? listing.model ?? ""}`.trim() ||
                                          listing.title ||
                                          item.text
                                        : item.text}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  );
}
