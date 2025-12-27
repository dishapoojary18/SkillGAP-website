import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  ChevronDown,
  Menu,
  X,
  Briefcase,
  FileText,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      name: "Home",
      path: "/dashboard",
      hasDropdown: true,
      dropdownItems: [
        { name: "Internships", path: "/internships", icon: Briefcase },
        { name: "Resume Templates", path: "/templates", icon: FileText },
      ],
    },
    { name: "About", path: "/about" },
    { name: "Q&A", path: "/qa" },
    { name: "Ratings", path: "/ratings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card px-6 py-3 flex items-center justify-between"
        >
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-display font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
            >
              SkillGAP
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && setIsHomeDropdownOpen(true)
                }
                onMouseLeave={() =>
                  item.hasDropdown && setIsHomeDropdownOpen(false)
                }
              >
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isHomeDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {isHomeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-52 glass-card p-2 shadow-lg"
                      >
                        {item.dropdownItems?.map((dropItem) => (
                          <Link
                            key={dropItem.name}
                            to={dropItem.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <dropItem.icon className="w-4 h-4 text-primary" />
                            {dropItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => navigate("/signup")}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 glass-card p-4 overflow-hidden"
            >
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.path}
                    className="block px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown &&
                    item.dropdownItems?.map((dropItem) => (
                      <Link
                        key={dropItem.name}
                        to={dropItem.path}
                        className="flex items-center gap-3 px-8 py-2 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <dropItem.icon className="w-4 h-4 text-primary" />
                        {dropItem.name}
                      </Link>
                    ))}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-border flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={() => {
                    navigate("/signup");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
