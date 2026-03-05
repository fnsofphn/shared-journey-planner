import { useState } from "react";
import { Plus, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Photo, generateId } from "@/lib/store";

export default function Album() {
  const [photos, setPhotos] = useState<Photo[]>(store.getPhotos());
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!preview) return;
    const p: Photo = { id: generateId(), url: preview, caption, date: new Date().toISOString() };
    const updated = [p, ...photos];
    setPhotos(updated);
    store.setPhotos(updated);
    setPreview(null);
    setCaption("");
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Photo Memories</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Upload
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card-warm p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Upload Photo</h2>
                <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              ) : (
                <label className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition">
                  <span className="text-sm text-muted-foreground">Click to select photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
              )}
              <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <button onClick={save} disabled={!preview} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50">Save Photo</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {viewPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/80 z-50 flex items-center justify-center p-4" onClick={() => setViewPhoto(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-3xl max-h-[85vh] relative">
              <img src={viewPhoto.url} alt={viewPhoto.caption} className="max-h-[80vh] rounded-2xl object-contain" />
              {viewPhoto.caption && <p className="text-center text-primary-foreground text-sm mt-3">{viewPhoto.caption}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} onClick={() => setViewPhoto(p)} className="cursor-pointer group">
            <div className="aspect-square rounded-2xl overflow-hidden relative">
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-primary-foreground text-xs truncate">{p.caption}</p>
                <div className="flex items-center gap-1 text-primary-foreground/70">
                  <Calendar className="h-3 w-3" />
                  <span className="text-[10px]">{new Date(p.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {photos.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">No photos yet. Start capturing memories!</p>}
    </div>
  );
}
