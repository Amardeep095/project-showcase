import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useWebsites } from "../hooks/useWebsites";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/ui/Navbar";
import WebsiteForm from "../components/admin/WebsiteForm";
import SortableItem from "../components/admin/SortableItem";
import SkeletonCard from "../components/ui/SkeletonCard";
import {
  Plus, LogOut, Globe, Eye, LayoutGrid, List,
  AlertCircle, Inbox, Trash2, X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { websites, loading, error, createWebsite, updateWebsite, deleteWebsite, reorderWebsites } =
    useWebsites();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState("list"); // list | grid

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = websites.findIndex((w) => w._id === active.id);
    const newIndex = websites.findIndex((w) => w._id === over.id);
    const reordered = arrayMove(websites, oldIndex, newIndex);
    reorderWebsites(reordered).catch(() => toast.error("Reorder failed"));
  };

  const openAdd = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (w) => { setEditTarget(w); setShowForm(true); };

  const handleSave = async (form) => {
    if (editTarget?._id) {
      await updateWebsite(editTarget._id, form);
    } else {
      await createWebsite(form);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteWebsite(deleteTarget._id);
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // Stats
  const stats = {
    total: websites.length,
    live: websites.filter((w) => w.status === "live").length,
    featured: websites.filter((w) => w.featured).length,
    totalViews: websites.reduce((acc, w) => acc + (w.views || 0), 0),
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display font-black text-3xl text-white">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your project showcase
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-slate-300 border border-white/10 glass hover:bg-white/8 transition-all"
            >
              <Globe size={14} /> View Site
            </Link>
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-cyan hover:shadow-glow-blue transition-all"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Projects", value: stats.total, color: "text-accent-blue" },
            { label: "Live", value: stats.live, color: "text-accent-emerald" },
            { label: "Featured", value: stats.featured, color: "text-accent-purple" },
            { label: "Total Views", value: stats.totalViews, color: "text-accent-cyan" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-2xl bg-bg-card border border-white/6"
            >
              <div className={`font-display font-black text-3xl ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* View Toggle + List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-lg">
              Projects{" "}
              <span className="text-slate-500 font-normal text-base">
                ({websites.length})
              </span>
            </h2>
            <div className="flex items-center gap-1 glass rounded-xl p-1">
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-colors ${
                  view === "list" ? "bg-accent-blue/20 text-accent-blue" : "text-slate-500 hover:text-white"
                }`}
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  view === "grid" ? "bg-accent-blue/20 text-accent-blue" : "text-slate-500 hover:text-white"
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 py-8 justify-center text-red-400">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {loading ? (
            <div className={view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"}>
              {Array.from({ length: 4 }).map((_, i) =>
                view === "grid" ? <SkeletonCard key={i} /> : (
                  <div key={i} className="h-20 rounded-xl skeleton" />
                )
              )}
            </div>
          ) : websites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Inbox size={48} strokeWidth={1} className="mb-4 opacity-40" />
              <p className="text-lg font-medium text-slate-400">No projects yet</p>
              <button
                onClick={openAdd}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-cyan"
              >
                + Add your first project
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={websites.map((w) => w._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-2"}>
                  {websites.map((website) => (
                    <SortableItem
                      key={website._id}
                      website={website}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </motion.div>
      </div>

      {/* Website Form Modal */}
      <AnimatePresence>
        {showForm && (
          <WebsiteForm
            initial={editTarget}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditTarget(null); }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm glass-strong rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Delete Project?</h3>
                  <p className="text-sm text-slate-400">This cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-6 px-1">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">"{deleteTarget.name}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 glass hover:bg-white/8 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Trash2 size={14} /> Delete</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
