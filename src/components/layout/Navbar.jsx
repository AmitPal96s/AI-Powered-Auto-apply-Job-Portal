import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  User,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/JobGenieLogo_WhiteBackground.png";
import toast from "react-hot-toast";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const publicLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/register", label: "Register", icon: UserPlus },
  ];

  const privateLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const links = user ? privateLinks : publicLinks;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md px-4 sm:px-6 md:px-10 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img
            src={logo}
            alt="JobGenie Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 transition duration-300 ${isActive
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
          
        </div>


        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 bg-white shadow-md rounded-xl p-4">
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
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
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