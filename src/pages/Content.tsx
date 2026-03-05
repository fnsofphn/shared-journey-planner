import { useState } from "react";
import { Book, Film, Music, Plus, X, ExternalLink, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, ContentItem, generateId } from "@/lib/store";

const tabs = [
  { type: "book" as const, label: "Books", icon: Book },
  { type: "movie" as const, label: "Movies", icon: Film },
  { type: "music" as const, label: "Music", icon: Music },
];

export default function Content() {
  const [items, setItems] = useState<ContentItem[]>(store.getContent());
  const [activeTab, setActiveTab] = useState<ContentItem["type"]>("book");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", link: "", notes: "" });

  const filtered = items.filter(i => i.type === activeTab);

  const save = () => {
    if (!form.title.trim()) return;
    const item: ContentItem = { ...form, id: generateId(), type: activeTab, status: "planned" };
    const updated = [item, ...items];
    setItems(updated);
    store.setContent(updated);
    setForm({ title: "", link: "", notes: "" });
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, status: (i.status === "planned" ? "completed" : "planned") as ContentItem["status"] } : i);
    setItems(updated);
    store.setContent(updated);
  };

  const remove = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    store.setContent(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Shared Content</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(t => (
          <button key={t.type} onClick={() => setActiveTab(t.type)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === t.type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card-warm p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Add {activeTab}</h2>
                <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="Link (optional)" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
              <button onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition">Add Item</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="card-warm p-4 flex items-center gap-4 group">
            <button onClick={() => toggleStatus(item.id)} className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${item.status === "completed" ? "bg-warm-sage border-warm-sage" : "border-border hover:border-primary"}`}>
              {item.status === "completed" && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{item.title}</h3>
              {item.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.notes}</p>}
            </div>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:opacity-80">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">No items yet. Start adding!</p>}
    </div>
  );
}
