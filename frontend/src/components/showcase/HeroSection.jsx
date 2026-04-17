import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

export default function HeroSection({ count }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #3b82f6, #8b5cf6, transparent)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-[10%] w-3 h-3 rounded-full bg-accent-blue/40 blur-sm"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 right-[12%] w-2 h-2 rounded-full bg-accent-purple/50 blur-sm"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-accent-cyan/60"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-slate-300 mb-8"
        >
          <Sparkles size={14} className="text-accent-cyan" />
          {count > 0 ? `${count} projects and counting` : "Personal project gallery"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-tight mb-6"
        >
          My{" "}
          <span className="text-gradient">Digital</span>
          <br />
          Creations
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-10"
        >
          A curated gallery of live projects — from web apps to tools,
          built with modern tech and{" "}
          <span className="text-slate-300">a lot of passion.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#showcase"
            className="group px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-accent-blue to-accent-cyan hover:from-accent-blue/90 hover:to-accent-cyan/90 shadow-glow-blue transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
          >
            View Projects
          </a>
          <a
            href="#showcase"
            className="px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white border border-white/10 hover:border-white/20 glass hover:bg-white/8 transition-all duration-300"
          >
            About Me
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
