import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { websiteApi } from "../lib/api";
import Navbar from "../components/ui/Navbar";
import StatusBadge from "../components/ui/StatusBadge";
import {
  ArrowLeft, ExternalLink, Github, ChevronLeft,
  ChevronRight, Eye, Calendar, AlertCircle,
} from "lucide-react";

export default function SitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await websiteApi.getOne(id);
        setWebsite(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Website not found");
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-slate-300">{error || "Not found"}</p>
        <Link to="/" className="text-accent-blue hover:underline text-sm">
          ← Back to Gallery
        </Link>
      </div>
    );
  }

  const images = website.images?.length > 0 ? website.images : [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={website.status} size="lg" />
            {website.featured && (
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium">
                Featured Project
              </span>
            )}
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-4 leading-tight">
            {website.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {website.views > 0 && (
              <span className="flex items-center gap-1.5">
                <Eye size={13} /> {website.views} views
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date(website.createdAt).toLocaleDateString("en-US", {
                month: "long", year: "numeric",
              })}
            </span>
          </div>
        </motion.div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10 rounded-2xl overflow-hidden border border-white/8 shadow-card"
          >
            {/* Main Image */}
            <div className="relative aspect-video bg-bg-secondary">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={`${website.name} screenshot ${activeImg + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {hasMultipleImages && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i === activeImg ? "w-4 bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="flex gap-2 p-3 bg-bg-secondary border-t border-white/5 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImg ? "border-accent-blue" : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Description + Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-6 rounded-2xl bg-bg-card border border-white/6">
              <h2 className="font-display font-semibold text-white text-lg mb-4">About</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {website.description}
              </p>
            </div>

            {/* Tech Stack */}
            {website.techStack?.length > 0 && (
              <div className="p-6 rounded-2xl bg-bg-card border border-white/6">
                <h2 className="font-display font-semibold text-white text-lg mb-4">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {website.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-sm font-mono bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {website.liveUrl && (
              <a
                href={website.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-accent-blue to-accent-cyan shadow-glow-blue hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300"
              >
                <ExternalLink size={15} />
                Visit Website
              </a>
            )}
            {website.githubUrl && (
              <a
                href={website.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl font-semibold text-sm text-white border border-white/10 hover:border-white/20 glass hover:bg-white/8 transition-all duration-300"
              >
                <Github size={15} />
                View Source Code
              </a>
            )}

            {/* Stats Card */}
            <div className="p-5 rounded-2xl bg-bg-card border border-white/6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <StatusBadge status={website.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Views</span>
                  <span className="text-white font-mono">{website.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Added</span>
                  <span className="text-white">
                    {new Date(website.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
