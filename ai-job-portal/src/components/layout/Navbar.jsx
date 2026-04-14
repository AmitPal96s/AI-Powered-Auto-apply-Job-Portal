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
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="JobGenie Logo" className="h-10" />
          <span className="text-xl font-bold text-gray-800">JobGenie</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 transition duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

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

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 bg-white shadow-md rounded-xl p-4">
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
                <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}

          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600"
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-lg text-red-500 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
