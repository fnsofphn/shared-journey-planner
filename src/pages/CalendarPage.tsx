import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Appointment, generateId } from "@/lib/store";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(store.getAppointments());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", notes: "", activityIds: [] as string[] });

  const activities = store.getActivities();
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDay = start.getDay();

  const selectedAppts = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(a => isSameDay(new Date(a.date), selectedDate));
  }, [selectedDate, appointments]);

  const createAppointment = () => {
    if (!form.name.trim() || !selectedDate) return;
    const selectedActs = activities.filter(a => form.activityIds.includes(a.id));
    const totalCost = selectedActs.reduce((s, a) => s + a.estimatedCost, 0);
    const newAppt: Appointment = {
      id: generateId(), name: form.name, date: selectedDate.toISOString(),
      description: form.description, activityIds: form.activityIds, notes: form.notes,
      photos: [], totalCost,
    };
    const updated = [...appointments, newAppt];
    setAppointments(updated);
    store.setAppointments(updated);
    setForm({ name: "", description: "", notes: "", activityIds: [] });
    setShowForm(false);
  };

  const toggleActivity = (id: string) => {
    setForm(f => ({ ...f, activityIds: f.activityIds.includes(id) ? f.activityIds.filter(x => x !== id) : [...f.activityIds, id] }));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="font-display text-2xl md:text-3xl font-bold">Calendar</h1>

      {/* Month Nav */}
      <div className="card-warm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-muted rounded-xl transition"><ChevronLeft className="h-5 w-5" /></button>
          <h2 className="font-display font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-muted rounded-xl transition"><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
          {days.map(day => {
            const hasAppt = appointments.some(a => isSameDay(new Date(a.date), day));
            const selected = selectedDate && isSameDay(day, selectedDate);
            return (
              <button
                key={day.toISOString()}
                onClick={() => { setSelectedDate(day); }}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                  selected ? "bg-primary text-primary-foreground shadow-md" :
                  isToday(day) ? "bg-accent/10 text-accent font-semibold" :
                  "hover:bg-muted"
                }`}
              >
                {day.getDate()}
                {hasAppt && <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-warm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">{format(selectedDate, "EEEE, MMM d")}</h3>
            <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl px-3 py-1.5 text-xs font-medium flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          {selectedAppts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedAppts.map(a => (
                <div key={a.id} className="bg-muted/50 rounded-xl p-3">
                  <h4 className="font-semibold text-sm">{a.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                  {a.totalCost > 0 && <p className="text-xs text-primary font-medium mt-1">Est. cost: ${a.totalCost}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Appointment Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card-warm p-6 w-full max-w-md space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">New Appointment</h2>
                <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Appointment name" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
              {activities.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Select activities:</p>
                  <div className="flex flex-wrap gap-2">
                    {activities.map(a => (
                      <button key={a.id} onClick={() => toggleActivity(a.id)} className={`text-xs px-3 py-1.5 rounded-full border transition ${form.activityIds.includes(a.id) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                        {a.name} (${a.estimatedCost})
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes" rows={2} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
              <button onClick={createAppointment} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition">Create Appointment</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
