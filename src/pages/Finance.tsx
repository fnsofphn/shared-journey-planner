import { useState, useMemo } from "react";
import { Plus, X, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Transaction, generateId } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(store.getTransactions());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "income" as Transaction["type"], amount: 0, description: "", category: "", date: format(new Date(), "yyyy-MM-dd") });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const monthlyData = useMemo(() => {
    const map: Record<string, { month: string; income: number; expense: number }> = {};
    transactions.forEach(t => {
      const m = format(new Date(t.date), "MMM");
      if (!map[m]) map[m] = { month: m, income: 0, expense: 0 };
      map[m][t.type] += t.amount;
    });
    return Object.values(map).slice(-6);
  }, [transactions]);

  const save = () => {
    if (!form.amount || !form.description.trim()) return;
    const t: Transaction = { ...form, id: generateId() };
    const updated = [t, ...transactions];
    setTransactions(updated);
    store.setTransactions(updated);
    setForm({ type: "income", amount: 0, description: "", category: "", date: format(new Date(), "yyyy-MM-dd") });
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Finance</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Balance", value: balance, icon: Wallet, color: "text-primary" },
          { label: "Income", value: totalIncome, icon: TrendingUp, color: "text-warm-sage" },
          { label: "Expense", value: totalExpense, icon: TrendingDown, color: "text-warm-rose" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-warm p-4 text-center">
            <s.icon className={`h-5 w-5 mx-auto ${s.color}`} />
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            <p className="text-lg font-semibold mt-0.5">${s.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {monthlyData.length > 0 && (
        <div className="card-warm p-4 md:p-6">
          <h3 className="font-display font-semibold mb-4">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="income" fill="hsl(150, 25%, 55%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="hsl(350, 50%, 65%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card-warm p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Add Transaction</h2>
                <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <div className="flex gap-2">
                {(["income", "expense"] as const).map(t => (
                  <button key={t} onClick={() => setForm({ ...form, type: t })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${form.type === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <input type="number" value={form.amount || ""} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} placeholder="Amount" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <button onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition">Save</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction List */}
      <div className="space-y-2">
        {transactions.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="card-warm p-4 flex items-center gap-4">
            <div className={`rounded-xl p-2 ${t.type === "income" ? "bg-warm-sage/10" : "bg-warm-rose/10"}`}>
              {t.type === "income" ? <TrendingUp className="h-4 w-4 text-warm-sage" /> : <TrendingDown className="h-4 w-4 text-warm-rose" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t.description}</p>
              <p className="text-xs text-muted-foreground">{t.category} · {new Date(t.date).toLocaleDateString()}</p>
            </div>
            <span className={`text-sm font-semibold ${t.type === "income" ? "text-warm-sage" : "text-warm-rose"}`}>
              {t.type === "income" ? "+" : "-"}${t.amount}
            </span>
          </motion.div>
        ))}
      </div>
      {transactions.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">No transactions yet.</p>}
    </div>
  );
}
