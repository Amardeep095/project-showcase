import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

const STATUSES = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "beta", label: "Beta" },
  { value: "wip", label: "WIP" },
  { value: "archived", label: "Archived" },
];

export default function FilterBar({ search, setSearch, status, setStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl mx-auto"
    >
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, tech..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-white placeholder-slate-500 outline-none focus:border-accent-blue/50 focus:bg-white/8 transition-all duration-200 font-sans"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status Pills */}
      <div className="flex gap-1.5 glass rounded-xl p-1">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              status === s.value
                ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
