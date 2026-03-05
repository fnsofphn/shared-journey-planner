import { useState } from "react";
import { Plus, X, FileText, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { store, Contract, generateId } from "@/lib/store";

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>(store.getContracts());
  const [showForm, setShowForm] = useState(false);
  const [viewContract, setViewContract] = useState<Contract | null>(null);
  const [form, setForm] = useState({ partyA: "", partyB: "", jobDescription: "", duration: "", terms: "" });

  const save = () => {
    if (!form.partyA.trim() || !form.partyB.trim()) return;
    const c: Contract = { ...form, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [c, ...contracts];
    setContracts(updated);
    store.setContracts(updated);
    setForm({ partyA: "", partyB: "", jobDescription: "", duration: "", terms: "" });
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Contracts</h1>
        <button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> New Contract
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="card-warm p-6 w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">New Contract</h2>
                <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.partyA} onChange={e => setForm({ ...form, partyA: e.target.value })} placeholder="Party A" className="bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
                <input value={form.partyB} onChange={e => setForm({ ...form, partyB: e.target.value })} placeholder="Party B" className="bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              </div>
              <textarea value={form.jobDescription} onChange={e => setForm({ ...form, jobDescription: e.target.value })} placeholder="Job description" rows={3} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
              <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Contract duration" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none" />
              <textarea value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} placeholder="Terms and conditions" rows={5} className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
              <button onClick={save} className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition">Create Contract</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contract Viewer */}
      <AnimatePresence>
        {viewContract && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-card rounded-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-border">
              <button onClick={() => setViewContract(null)} className="float-right"><X className="h-5 w-5 text-muted-foreground" /></button>
              <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold">CONTRACT AGREEMENT</h2>
                <div className="h-0.5 w-20 bg-primary mx-auto mt-3" />
              </div>
              <div className="space-y-6 text-sm leading-relaxed">
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="text-xs text-muted-foreground mb-1">PARTY A</p><p className="font-semibold">{viewContract.partyA}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">PARTY B</p><p className="font-semibold">{viewContract.partyB}</p></div>
                </div>
                <div><p className="text-xs text-muted-foreground mb-1">JOB DESCRIPTION</p><p>{viewContract.jobDescription}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">DURATION</p><p>{viewContract.duration}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">TERMS & CONDITIONS</p><p className="whitespace-pre-wrap">{viewContract.terms}</p></div>
                <div className="border-t border-border pt-6 mt-8 grid grid-cols-2 gap-6">
                  <div><div className="border-b border-foreground/20 mb-2 h-12" /><p className="text-xs text-muted-foreground">{viewContract.partyA} — Signature</p></div>
                  <div><div className="border-b border-foreground/20 mb-2 h-12" /><p className="text-xs text-muted-foreground">{viewContract.partyB} — Signature</p></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contract List */}
      <div className="space-y-3">
        {contracts.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-warm p-4 flex items-center gap-4 group">
            <div className="bg-primary/10 rounded-xl p-2.5">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">{c.partyA} × {c.partyB}</h3>
              <p className="text-xs text-muted-foreground truncate">{c.jobDescription}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => setViewContract(c)} className="text-accent hover:opacity-80">
              <Eye className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
      {contracts.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">No contracts yet.</p>}
    </div>
  );
}
