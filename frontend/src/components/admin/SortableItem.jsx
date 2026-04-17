import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, ExternalLink } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

export default function SortableItem({ website, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: website._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
        isDragging
          ? "border-accent-blue/40 bg-accent-blue/5 shadow-glow-blue"
          : "border-white/6 bg-bg-card hover:border-white/12"
      }`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-slate-600 hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none p-1"
      >
        <GripVertical size={16} />
      </button>

      {/* Preview Image */}
      <div className="w-16 h-10 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0 border border-white/5">
        {website.images?.[0] ? (
          <img src={website.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700 text-xs font-bold">
            {website.name?.[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm truncate">{website.name}</span>
          <StatusBadge status={website.status} />
          {website.featured && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
              Featured
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {website.shortDescription || website.description}
        </p>
      </div>

      {/* Tags - desktop only */}
      <div className="hidden md:flex gap-1.5 flex-shrink-0">
        {website.techStack?.slice(0, 3).map((t) => (
          <span key={t} className="tag-chip">{t}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {website.liveUrl && (
          <a
            href={website.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg text-slate-500 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        )}
        <button
          onClick={() => onEdit(website)}
          className="p-2 rounded-lg text-slate-500 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(website)}
          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
