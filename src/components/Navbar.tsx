import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ChevronDown,
  Menu,
  X,
  Briefcase,
  FileText,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  const handleLogout = async () => {
    await signOut();
    setIsProfileDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/dashboard");
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";

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

            {/* Upload Resume Link */}
            <Link
              to="/upload"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                isActive("/upload")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Resume
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              )}
            </button>

            {isAuthenticated && user ? (
              /* Profile Dropdown */
              <div
                className="relative"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 glass-card p-2 shadow-lg"
                    >
                      <div className="px-4 py-3 border-b border-border mb-2">
                        <p className="font-medium text-foreground">{displayName}</p>
                        <p className="text-sm text-muted-foreground">{displayEmail}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth Buttons */
              <>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
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
              {isAuthenticated && user && (
                <div className="px-4 py-3 mb-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{displayName}</p>
                      <p className="text-sm text-muted-foreground">{displayEmail}</p>
                    </div>
                  </div>
                </div>
              )}

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

              <Link
                to="/upload"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Upload className="w-4 h-4 text-primary" />
                Upload Resume
              </Link>

              <div className="mt-4 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <div className="flex gap-3">
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
