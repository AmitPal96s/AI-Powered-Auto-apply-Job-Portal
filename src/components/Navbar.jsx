import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Briefcase,
  User,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/JobGenieLogo_WhiteBackground.png"; // Adjust path if necessary

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/register", label: "Register", icon: UserPlus },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-3 flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img
            src={logo}
            alt="JobGenie Logo"
            className="h-18 sm:h-20 md:h-15 w-auto object-contain bg-white"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {navItems.map(({ to, label, icon: Icon }) => (
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white shadow-md">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 text-lg transition duration-300 ${isActive
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;