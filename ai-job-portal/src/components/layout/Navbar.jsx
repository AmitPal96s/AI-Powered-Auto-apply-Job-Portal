import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  User,
  LayoutDashboard,
  FileText,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/JobGenieLogo_WhiteBackground.png";
import toast from "react-hot-toast";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = user?.profile?.avatarUrl || "";
  const displayName = user?.name || "User";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Links for non-authenticated users
  const publicLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/register", label: "Register", icon: UserPlus },
  ];

  // Links for authenticated users
  const privateLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/applications", label: "Applications", icon: FileText },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const links = user ? privateLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button
          type="button"
          className="flex items-center gap-2 text-left"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="JobGenie Logo" className="h-8 w-auto sm:h-10" />
          <span className="text-lg font-bold text-gray-800 sm:text-xl">
            JobGenie
          </span>
        </button>

        <div className="hidden items-center gap-4 font-medium md:flex lg:gap-6">
          {links.map(({ to, label, icon: Icon }) => {
            const LinkIcon = Icon;

            return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 py-2 text-sm transition duration-300 ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                }`
              }
            >
              <LinkIcon className="h-4 w-4" />
              {label}
            </NavLink>
          );
          })}

          {user && (
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-sm font-bold text-blue-700">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${displayName} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "U"
                )}
              </div>
              <span className="max-w-32 truncate text-sm font-semibold text-gray-800">
                {displayName}
              </span>
            </div>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-4 max-w-7xl space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg md:hidden"
        >
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-pink-100 text-sm font-bold text-blue-700">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${displayName} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials || "U"
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {links.map(({ to, label, icon: Icon }) => {
            const LinkIcon = Icon;

            return (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-3 text-base transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <LinkIcon className="h-5 w-5" />
                {label}
              </span>
            </NavLink>
          );
          })}

          {user && (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
