const STATUS_CONFIG = {
  live:     { label: "Live",     dot: "#10b981", cls: "badge-live" },
  beta:     { label: "Beta",     dot: "#f59e0b", cls: "badge-beta" },
  wip:      { label: "WIP",      dot: "#3b82f6", cls: "badge-wip" },
  archived: { label: "Archived", dot: "#6b7280", cls: "badge-archived" },
};

export default function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.live;
  const sizeClass = size === "lg" ? "text-xs px-3 py-1" : "text-xs px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-medium ${cfg.cls} ${sizeClass}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
        style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
      />
      {cfg.label}
    </span>
  );
}
