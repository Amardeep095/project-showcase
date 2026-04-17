import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { ExternalLink, Github, Eye } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

export default function WebsiteCard({ website, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const previewImage = website.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Tilt
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        scale={1.02}
        transitionSpeed={600}
        glareEnable
        glareMaxOpacity={0.06}
        glareColor="#3b82f6"
        glarePosition="all"
        className="h-full"
      >
        <div
          onClick={() => navigate(`/site/${website._id}`)}
          className="group relative h-full flex flex-col rounded-2xl overflow-hidden border border-white/6 bg-bg-card cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-500 hover:border-white/12"
        >
          {/* Glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
            style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.04), transparent 60%)" }}
          />

          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-bg-secondary flex-shrink-0">
            {!imgLoaded && !imgError && (
              <div className="absolute inset-0 skeleton" />
            )}
            {previewImage && !imgError ? (
              <img
                src={previewImage}
                alt={website.name}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl opacity-10 font-display font-black text-white select-none">
                  {website.name?.[0]?.toUpperCase()}
                </div>
                <div className="absolute inset-0 grid-bg opacity-50" />
              </div>
            )}

            {/* Status overlay */}
            <div className="absolute top-3 left-3">
              <StatusBadge status={website.status} />
            </div>

            {/* Featured badge */}
            {website.featured && (
              <div className="absolute top-3 right-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium">
                  Featured
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
              <div className="flex gap-2">
                {website.liveUrl && (
                  <a
                    href={website.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg glass text-white hover:text-accent-cyan transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                {website.githubUrl && (
                  <a
                    href={website.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg glass text-white hover:text-accent-blue transition-colors"
                  >
                    <Github size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-white text-lg leading-tight group-hover:text-gradient transition-all duration-300 line-clamp-1">
                {website.name}
              </h3>
              {website.views > 0 && (
                <span className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0 mt-0.5">
                  <Eye size={11} />
                  {website.views}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 flex-1">
              {website.shortDescription || website.description}
            </p>

            {/* Tech Stack */}
            {website.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {website.techStack.slice(0, 5).map((tech) => (
                  <span key={tech} className="tag-chip">{tech}</span>
                ))}
                {website.techStack.length > 5 && (
                  <span className="tag-chip text-slate-500">
                    +{website.techStack.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}
