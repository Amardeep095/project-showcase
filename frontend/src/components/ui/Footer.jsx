import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Github, Twitter, Linkedin, Mail, Globe,
  Code2, ArrowUpRight, Heart, Sparkles,
} from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Github,   href: "https://github.com/Amardeep095",   label: "GitHub" },
  { icon: Number,  href: "+91 7991167574",  label: "Number" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/amardeepkumar090/", label: "LinkedIn" },
  { icon: Mail,     href: "mailto:1324Amardeep@gmail.com", label: "Email" },
];

const TECH_STACK = [
  { name: "React",      color: "#61DAFB" },
  { name: "Node.js",    color: "#68A063" },
  { name: "MongoDB",    color: "#47A248" },
  { name: "Cloudinary", color: "#3448C5" },
  { name: "Vercel",     color: "#ffffff" },
  { name: "Tailwind",   color: "#06B6D4" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-8 blur-[100px] pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse, #3b82f6, #8b5cf6, transparent)" }}
      />

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-glow-blue group-hover:shadow-glow-purple transition-all duration-300">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                dev<span className="text-gradient">showcase</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A curated gallery of live projects — crafted with modern tech,
              attention to detail, and a lot of passion.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-accent-blue/40 hover:bg-accent-blue/10 transition-colors duration-200"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: "All Projects", to: "/", hash: "#showcase" },
                { label: "Admin Dashboard", to: "/admin" },
                { label: "Admin Login", to: "/admin/login" },
              ].map(({ label, to, hash }) => (
                <li key={label}>
                  <Link
                    to={to}
                    onClick={() => hash && setTimeout(() => {
                      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
                    }, 100)}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Built with */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-widest">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map(({ name, color }) => (
                <motion.span
                  key={name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/8 text-xs font-mono text-slate-300 hover:border-white/20 transition-colors cursor-default"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                  />
                  {name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            <span>© {year} Amardeep Showcase. Made with</span>
            <Heart size={12} className="text-red-400 fill-red-400" />
            <span>by a developer, for developers.</span>
          </p>

          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full glass border border-white/8">
            <Sparkles size={12} className="text-accent-cyan" />
            <span className="text-xs text-slate-400 font-mono">
              Open to opportunities
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
          </div>
        </motion.div>

      </div>
    </footer>
  );
}
