import { useState } from "react";
import { Plus, Pin, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Note, generateId } from "@/lib/store";

const colorOptions = [
  "bg-card", "bg-primary/5", "bg-accent/5", "bg-warm-rose/10", "bg-warm-sage/10", "bg-warm-gold/10",
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(store.getNotes());
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [color, setColor] = useState(colorOptions[0]);

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const save = () => {
    if (!content.trim()) return;
    const n: Note = { id: generateId(), content, color, pinned: false, createdAt: new Date().toISOString() };
    const updated = [n, ...notes];
    setNotes(updated);
    store.setNotes(updated);
    setContent("");
    setShowForm(false);
  };

  const togglePin = (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    setNotes(updated);
    store.setNotes(updated);
  };

  const remove = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    store.setNotes(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Quick Notes</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> New Note
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card-warm p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">New Note</h2>
                <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note..." rows={4} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none resize-none" />
              <div className="flex gap-2">
                {colorOptions.map(c => (
                  <button key={c} onClick={() => setColor(c)} className={`h-7 w-7 rounded-full border-2 ${c} ${color === c ? "border-primary" : "border-transparent"}`} />
                ))}
              </div>
              <button onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition">Save Note</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className={`${n.color} rounded-2xl border border-border p-4 group relative`}>
            {n.pinned && <Pin className="absolute top-3 right-3 h-3.5 w-3.5 text-primary fill-primary" />}
            <p className="text-sm whitespace-pre-wrap">{n.content}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePin(n.id)} className="p-1.5 hover:bg-muted rounded-lg"><Pin className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(n.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {notes.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">No notes yet. Jot something down!</p>}
    </div>
  );
}
