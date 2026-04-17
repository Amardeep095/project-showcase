import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import WebsiteCard from "../components/showcase/WebsiteCard";
import FilterBar from "../components/showcase/FilterBar";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useWebsites } from "../hooks/useWebsites";
import { AlertCircle, Inbox, Layers } from "lucide-react";

export default function HomePage() {
  const { websites, loading, error } = useWebsites();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    let lenis;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }).catch(() => {});
    return () => lenis?.destroy();
  }, []);

  const filtered = useMemo(() => {
    return websites.filter((w) => {
      const matchStatus = status === "all" || w.status === status;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.techStack?.some((t) => t.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [websites, search, status]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-10 blur-[80px] pointer-events-none rounded-full"
          style={{ background: "radial-gradient(ellipse, #3b82f6, #8b5cf6, transparent)" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-slate-400 font-mono">
                <Layers size={11} className="text-accent-cyan" />
                {loading ? "Loading..." : `${websites.length} project${websites.length !== 1 ? "s" : ""} live`}
              </div>
              {!loading && websites.some((w) => w.featured) && (
                <div className="px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-xs text-accent-purple font-mono">
                  ✦ Featured picks available
                </div>
              )}
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-4">
              Project <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Every card is a live website. Click to explore the full story behind each one.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Showcase */}
      <section className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10"
          >
            <FilterBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
          </motion.div>

          <AnimatePresence>
            {(search || status !== "all") && !loading && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-sm text-slate-500 mb-6 font-mono"
              >
                {filtered.length === 0 ? "No results" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              </motion.p>
            )}
          </AnimatePresence>

          {error && (
            <div className="flex items-center justify-center gap-3 py-20 text-red-400">
              <AlertCircle size={20} /><span>{error}</span>
            </div>
          )}

          {!error && (
            <AnimatePresence mode="wait">
              {loading ? (
                <div key="skeleton" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-slate-500">
                  <Inbox size={52} strokeWidth={1} className="mb-5 opacity-30" />
                  <p className="text-lg font-medium text-slate-400 mb-1">
                    {search || status !== "all" ? "No projects match" : "No projects yet"}
                  </p>
                  <p className="text-sm">
                    {search || status !== "all" ? "Try different keywords or clear the filter" : "Add your first project from the admin dashboard"}
                  </p>
                </motion.div>
              ) : (
                <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((website, index) => (
                    <WebsiteCard key={website._id} website={website} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
