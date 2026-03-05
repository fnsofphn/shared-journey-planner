import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Appointment, generateId } from "@/lib/store";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";

export default function CalendarPage() {

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(store.getAppointments());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    notes: "",
    activityIds: [] as string[],
  });

  const activities = store.getActivities();

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDay = start.getDay();

  const selectedAppts = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter((a) =>
      isSameDay(new Date(a.date), selectedDate)
    );
  }, [selectedDate, appointments]);

  const toggleActivity = (id: string) => {
    setForm((f) => ({
      ...f,
      activityIds: f.activityIds.includes(id)
        ? f.activityIds.filter((x) => x !== id)
        : [...f.activityIds, id],
    }));
  };

  const createAppointment = () => {
    if (!selectedDate) return;

    const selectedActs = activities.filter((a) =>
      form.activityIds.includes(a.id)
    );

    const autoName =
      form.name.trim() ||
      selectedActs.map((a) => a.name).join(", ");

    const totalCost = selectedActs.reduce(
      (sum, a) => sum + a.estimatedCost,
      0
    );

    const newAppt: Appointment = {
      id: generateId(),
      name: autoName,
      date: selectedDate.toISOString(),
      description: form.description,
      activityIds: form.activityIds,
      notes: form.notes,
      photos: [],
      totalCost,
    };

    const updated = [...appointments, newAppt];
    setAppointments(updated);
    store.setAppointments(updated);

    setForm({
      name: "",
      description: "",
      notes: "",
      activityIds: [],
    });

    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

      <h1 className="font-display text-2xl md:text-3xl font-bold">
        Calendar
      </h1>

      {/* Calendar */}

      <div className="card-warm p-4 md:p-6">

        <div className="flex items-center justify-between mb-4">

          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-muted rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2 className="font-display font-semibold text-lg">
            {format(currentMonth, "MMMM yyyy")}
          </h2>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-muted rounded-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">

          {Array.from({ length: startDay }).map((_, i) => (
            <div key={i}></div>
          ))}

          {days.map((day) => {

            const hasAppt = appointments.some((a) =>
              isSameDay(new Date(a.date), day)
            );

            const selected =
              selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  setSelectedDate(day);
                  setShowForm(true);
                }}
                className={`relative aspect-square flex items-center justify-center rounded-xl text-sm
                ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : isToday(day)
                    ? "bg-accent/10 text-accent font-semibold"
                    : "hover:bg-muted"
                }`}
              >
                {day.getDate()}

                {hasAppt && (
                  <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Appointments */}

      {selectedDate && selectedAppts.length > 0 && (
        <div className="card-warm p-5 space-y-2">

          <h3 className="font-display font-semibold">
            {format(selectedDate, "EEEE, MMM d")}
          </h3>

          {selectedAppts.map((a) => (
            <div key={a.id} className="bg-muted/50 rounded-xl p-3">

              <h4 className="font-semibold text-sm">
                {a.name}
              </h4>

              {a.activityIds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {a.activityIds
                    .map(
                      (id) =>
                        activities.find((act) => act.id === id)?.name
                    )
                    .join(", ")}
                </p>
              )}

              {a.totalCost > 0 && (
                <p className="text-xs text-primary font-medium mt-1">
                  Cost: ${a.totalCost}
                </p>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Modal */}

      <AnimatePresence>

        {showForm && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="card-warm p-6 w-full max-w-md space-y-4 max-h-[80vh] overflow-y-auto"
            >

              <div className="flex justify-between items-center">

                <h2 className="font-display font-semibold text-lg">
                  New Appointment
                </h2>

                <button onClick={() => setShowForm(false)}>
                  <X className="h-5 w-5" />
                </button>

              </div>

              <input
                placeholder="Title (optional)"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full bg-muted rounded-xl px-4 py-2"
              />

              {/* Activities */}

              {activities.length > 0 && (
                <div>

                  <p className="text-xs text-muted-foreground mb-2">
                    Choose activities
                  </p>

                  <div className="space-y-2">

                    {activities.map((a) => (

                      <label
                        key={a.id}
                        className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-sm cursor-pointer"
                      >

                        <div className="flex items-center gap-2">

                          <input
                            type="checkbox"
                            checked={form.activityIds.includes(a.id)}
                            onChange={() => toggleActivity(a.id)}
                          />

                          {a.name}

                        </div>

                        <span className="text-xs text-primary">
                          ${a.estimatedCost}
                        </span>

                      </label>

                    ))}

                  </div>

                </div>
              )}

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="w-full bg-muted rounded-xl px-4 py-2"
              />

              <button
                onClick={createAppointment}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3"
              >
                Create
              </button>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}