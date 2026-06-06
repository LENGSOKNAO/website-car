import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  CircleUser,
  Search,
  User,
  List,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { APP_NAME, BRANDS, BRAND_PAGES } from "@/lib/constants";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [heroes, setHeroes] = useState<any[]>([]);
  const [navigating, setNavigating] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleNavigateToSettings = () => {
    setNavigating(true);
    navigate("/profile");
  };

  useEffect(() => {
    setMobileOpen(false);
    setHoveredCat(null);
    setNavigating(false);
  }, [location]);

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
      .heroes()
      .then((res: any) => {
        const raw = res?.data?.data ?? res?.data ?? res ?? [];
        setHeroes(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHoveredCat(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const brandRoutes = BRANDS.map((b) => {
    const bp = BRAND_PAGES.find((p) => p.slug === b.slug);
    return { ...b, route: bp?.route || `/listings?make=${b.slug}` };
  });

  const pageSlug = decodeURIComponent(location.pathname.split("/")[1] || "").toLowerCase();
  const currentSeller = sellers.find((s) => s.full_name.toLowerCase() === pageSlug) ?? null;
  const currentSellerId = currentSeller?.id ?? null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {navigating && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-50">
          <div className="h-full bg-blue-400 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="shrink-0">
            <span className="text-sm font-bold tracking-[0.15em] uppercase text-[#171A20]">
              {APP_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {sellers
                .filter((s) => s.id !== user?.id)
                .map((seller) => (
                    <button
                    key={seller.id}
                    onClick={() => {
                      const path = `/${encodeURIComponent(seller.full_name.toLowerCase())}`;
                      if (location.pathname === path) return;
                      setNavigating(true);
                      requestAnimationFrame(() => navigate(path));
                    }}
                    className={cn(
                      "block px-3 py-1.5 text-sm font-medium rounded-[4px] transition-colors",
                      currentSellerId === seller.id
                        ? "text-black"
                        : "text-[#5C5E62] hover:text-black",
                    )}
                  >
                    {seller.full_name}
                  </button>
                ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/search"
              className="p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms]"
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
              <DropdownMenu className="relative">
                <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms] rounded-[4px]">
                  <Avatar
                    name={user.full_name || "User"}
                    src={user.avatar_url}
                    size="sm"
                    className="w-5 h-5"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 right-0 mt-2 z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/orders")}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/messages")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Bag
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/wishlist")}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="p-1.5 text-[#5C5E62] hover:text-black transition-colors duration-[333ms] rounded-[4px]"
              >
                <CircleUser className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

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
                        setHoveredCat(hero.id);
                      }}
                      onMouseLeave={() => {
                        timeoutRef.current = setTimeout(
                          () => setHoveredCat(null),
                          100,
                        );
                      }}
                    >
                      <button
                        className={cn(
                          "h-full px-4 text-xs font-medium transition-colors tracking-wide",
                          isHovered
                            ? "text-black"
                            : "text-[#5C5E62] hover:text-black",
                        )}
                      >
                        {hero.title}
                      </button>
                      {isHovered && items.length > 0 && (
                        <div
                          className="fixed left-0 right-0 top-[104px] bg-white border-b border-gray-100 shadow-lg"
                          onMouseEnter={() => clearTimeout(timeoutRef.current)}
                          onMouseLeave={() => {
                            timeoutRef.current = setTimeout(
                              () => setHoveredCat(null),
                              100,
                            );
                          }}
                        >
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="space-y-1">
                              {items.map((item: any, i: number) => (
                                <div
                                  key={i}
                                  className="px-3 py-2 text-sm text-[#5C5E62]"
                                >
                                  {item.text}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-0.5">
            {brandRoutes.map((brand) => {
              const bp = BRAND_PAGES.find((p) => p.slug === brand.slug);
              const isActive = location.pathname === brand.route;
              return (
                <div key={brand.slug}>
                  <Link
                    to={brand.route}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium rounded-[4px] transition-colors",
                      isActive
                        ? "text-black"
                        : "text-[#5C5E62] hover:text-black",
                    )}
                  >
                    {brand.name}
                  </Link>
                  {bp && (
                    <div className="pl-4 pb-1 space-y-0.5">
                      {bp.models.map((model) => (
                        <Link
                          key={model}
                          to={`/listings?make=${brand.slug}&model=${model.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block px-4 py-2 text-xs text-[#5C5E62] hover:text-black"
                        >
                          {model}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {sellers
              .filter((s) => s.id !== user?.id)
              .map((seller) => (
                <button
                  key={seller.id}
                  onClick={() => {
                    const path = `/${encodeURIComponent(seller.full_name.toLowerCase())}`;
                    if (location.pathname === path) return;
                    setNavigating(true);
                    setMobileOpen(false);
                    requestAnimationFrame(() => navigate(path));
                  }}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-black hover:text-blue-600 transition-colors"
                >   
                  {seller.full_name}
                </button>
              ))}
            <hr className="border-gray-100 my-3" />
            <Link
              to="/search"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5C5E62] hover:text-black"
            >
              <Search className="w-4 h-4" /> Search
            </Link>
            <hr className="border-gray-100 my-3" />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5C5E62] hover:text-black w-full text-left">
                  <Avatar
                    name={user.full_name || "User"}
                    src={user.avatar_url}
                    size="sm"
                    className="w-4 h-4"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/orders")}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/messages")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Bag
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-3 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => navigate("/wishlist")}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#5C5E62] hover:text-black"
              >
                <CircleUser className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
