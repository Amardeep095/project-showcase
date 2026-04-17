import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Code2, LayoutDashboard, LogOut, ExternalLink } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-glow-blue group-hover:shadow-glow-purple transition-all duration-300">
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              dev<span className="text-gradient">showcase</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  {location.pathname !== "/admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isAdmin && (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                Admin
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
