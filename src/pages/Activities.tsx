import { useState } from "react";
import { Plus, Search, MapPin, Utensils, Film, Target, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Activity, generateId } from "@/lib/store";

const categoryIcons = { travel: MapPin, food: Utensils, entertainment: Film, goal: Target };
const categoryColors = { travel: "bg-accent/10 text-accent", food: "bg-primary/10 text-primary", entertainment: "bg-warm-lavender/20 text-warm-lavender", goal: "bg-warm-sage/20 text-warm-sage" };

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>(store.getActivities());
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", estimatedCost: 0, category: "travel" as Activity["category"], status: "planned" as Activity["status"] });

  const filtered = activities.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const save = () => {
    if (!form.name.trim()) return;
    const newAct: Activity = { ...form, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [newAct, ...activities];
    setActivities(updated);
    store.setActivities(updated);
    setForm({ name: "", description: "", estimatedCost: 0, category: "travel", status: "planned" });
    setShowForm(false);
  };

  const remove = (id: string) => {
    const updated = activities.filter(a => a.id !== id);
    setActivities(updated);
    store.setActivities(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Hoạt động</h1>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" /> Thêm mới
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm hoạt động..."
          className="w-full bg-muted rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card-warm p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Thêm hoạt động mới</h2>
                <button onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tên hoạt động"
                className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none"
              />

              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả"
                rows={3}
                className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
              />

              <input
                type="number"
                value={form.estimatedCost}
                onChange={e => setForm({ ...form, estimatedCost: Number(e.target.value) })}
                placeholder="Chi phí dự kiến"
                className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none"
              />

              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as Activity["category"] })}
                className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none"
              >
                <option value="travel">Du lịch</option>
                <option value="food">Ăn uống</option>
                <option value="entertainment">Giải trí</option>
                <option value="goal">Mục tiêu</option>
              </select>

              <button
                onClick={save}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition"
              >
                Tạo hoạt động
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((a, i) => {
          const Icon = categoryIcons[a.category];
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-warm p-4 flex items-start gap-4 group"
            >
              <div className={`rounded-xl p-2.5 ${categoryColors[a.category]}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{a.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.description}</p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-medium text-primary">${a.estimatedCost}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">
                    {a.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => remove(a.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-12">
          Chưa có hoạt động nào. Hãy tạo hoạt động đầu tiên!
        </p>
      )}
    </div>
  );
}