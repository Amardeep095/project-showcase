import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadApi } from "../../lib/api";
import { X, Upload, Plus, Trash2, Loader2, Link, Github } from "lucide-react";
import toast from "react-hot-toast";

const STATUSES = ["live", "beta", "wip", "archived"];

const EMPTY = {
  name: "", description: "", shortDescription: "",
  images: [], techStack: [], liveUrl: "", githubUrl: "",
  status: "live", featured: false,
};

export default function WebsiteForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [techInput, setTechInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.liveUrl && !/^https?:\/\/.+/.test(form.liveUrl))
      e.liveUrl = "Must be a valid URL (https://...)";
    if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl))
      e.githubUrl = "Must be a valid URL (https://...)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) set("techStack", [...form.techStack, t]);
    setTechInput("");
  };

  const removeTech = (t) => set("techStack", form.techStack.filter((x) => x !== t));

  const handleImages = async (files) => {
    if (!files?.length) return;
    if (form.images.length + files.length > 10) { toast.error("Max 10 images"); return; }
    setUploading(true);
    try {
      const res = await uploadApi.multiple(Array.from(files));
      set("images", [...form.images, ...res.data.urls]);
      toast.success(`${res.data.urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i) => set("images", form.images.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl glass-strong rounded-3xl shadow-[0_32px_100px_rgba(0,0,0,0.7)] flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky Header ─────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/8 rounded-t-3xl glass-strong">
          <h2 className="font-display font-bold text-xl text-white">
            {initial?._id ? "Edit Project" : "Add New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Body ────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(59,130,246,0.3) transparent" }}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Name */}
            <Field label="Project Name *" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="My Awesome App"
                className={inputCls(errors.name)}
              />
            </Field>

            {/* Short Description */}
            <Field label="Short Description" hint="Shown on cards (max 200 chars)">
              <input
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="One-liner summary..."
                maxLength={200}
                className={inputCls()}
              />
            </Field>

            {/* Full Description */}
            <Field label="Full Description *" error={errors.description}>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the project in detail..."
                rows={4}
                className={inputCls(errors.description) + " resize-none"}
              />
            </Field>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Live URL" error={errors.liveUrl}>
                <div className="relative">
                  <Link size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={form.liveUrl}
                    onChange={(e) => set("liveUrl", e.target.value)}
                    placeholder="https://myapp.com"
                    className={inputCls(errors.liveUrl) + " pl-9"}
                  />
                </div>
              </Field>
              <Field label="GitHub URL" error={errors.githubUrl}>
                <div className="relative">
                  <Github size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    value={form.githubUrl}
                    onChange={(e) => set("githubUrl", e.target.value)}
                    placeholder="https://github.com/..."
                    className={inputCls(errors.githubUrl) + " pl-9"}
                  />
                </div>
              </Field>
            </div>

            {/* Status + Featured */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className={inputCls() + " cursor-pointer"}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-bg-card capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Featured">
                <div className="flex items-center h-[46px]">
                  <button
                    type="button"
                    onClick={() => set("featured", !form.featured)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      form.featured ? "bg-accent-blue" : "bg-white/10"
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      form.featured ? "left-6" : "left-1"
                    }`} />
                  </button>
                  <span className="ml-3 text-sm text-slate-300">{form.featured ? "Yes" : "No"}</span>
                </div>
              </Field>
            </div>

            {/* Tech Stack */}
            <Field label="Tech Stack">
              <div className="flex gap-2 mb-2">
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                  placeholder="React, Node.js, MongoDB..."
                  className={inputCls() + " flex-1"}
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="px-4 py-2 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/30 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              {form.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.techStack.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 tag-chip">
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTech(t)}
                        className="text-blue-400/60 hover:text-red-400 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Image Upload */}
            <Field label={`Images (${form.images.length}/10)`}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImages(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full py-8 rounded-xl border-2 border-dashed border-white/15 hover:border-accent-blue/50 text-slate-400 hover:text-white transition-all duration-200 flex flex-col items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <><Loader2 size={22} className="animate-spin" /><span className="text-sm">Uploading...</span></>
                ) : (
                  <>
                    <Upload size={22} />
                    <span className="text-sm">Click to upload images</span>
                    <span className="text-xs text-slate-600">PNG, JPG, WebP up to 5MB each</span>
                  </>
                )}
              </button>

              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>

            {/* Extra bottom padding so last field isn't hidden under actions */}
            <div className="h-2" />
          </form>
        </div>

        {/* ── Sticky Footer Actions ──────────────────────── */}
        <div className="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-white/8 rounded-b-3xl glass-strong">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:border-white/20 glass hover:bg-white/8 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="website-form"
            disabled={saving}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-cyan disabled:opacity-50 hover:shadow-glow-blue transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" />Saving...</>
            ) : (
              initial?._id ? "Save Changes" : "Add Project"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        {label}
        {hint && <span className="text-xs text-slate-500 font-normal">— {hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return `w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 font-sans ${
    error
      ? "border-red-500/50 focus:border-red-500"
      : "border-white/10 focus:border-accent-blue/50 focus:bg-white/8"
  }`;
}
