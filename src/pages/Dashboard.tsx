import { useState, useEffect } from "react";
import { CalendarDays, Wallet, Image, StickyNote, Bell, Plus, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { store, NoticeItem, generateId } from "@/lib/store";
import heroDefault from "@/assets/hero-default.jpg";
import { Link } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

export default function Dashboard() {
  const [heroImg, setHeroImg] = useState(store.getHeroImage() || heroDefault);
  const [notices, setNotices] = useState<NoticeItem[]>(store.getNotices());
  const [newNotice, setNewNotice] = useState("");

  const appointments = store.getAppointments();
  const transactions = store.getTransactions();
  const photos = store.getPhotos();
  const notes = store.getNotes();

  const totalFund = transactions.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setHeroImg(url);
      store.setHeroImage(url);
    };
    reader.readAsDataURL(file);
  };

  const addNotice = () => {
    if (!newNotice.trim()) return;
    const updated = [{ id: generateId(), text: newNotice, date: new Date().toISOString() }, ...notices];
    setNotices(updated);
    store.setNotices(updated);
    setNewNotice("");
  };

  const widgets = [
    { icon: CalendarDays, label: "Lịch sắp tới", value: appointments.filter(a => new Date(a.date) >= new Date()).length, color: "text-accent", path: "/calendar" },
    { icon: Wallet, label: "Quỹ chung", value: `${totalFund.toLocaleString()}₫`, color: "text-warm-gold", path: "/finance" },
    { icon: Image, label: "Kỷ niệm", value: photos.length, color: "text-warm-rose", path: "/album" },
    { icon: StickyNote, label: "Ghi chú", value: notes.length, color: "text-warm-sage", path: "/notes" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden h-48 md:h-72 group"
      >
        <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

        <div className="absolute bottom-4 left-6 md:bottom-8 md:left-10">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-primary-foreground drop-shadow-lg flex items-center gap-2">
            Hành Trình Của Chúng Ta <Heart className="h-6 w-6 fill-primary text-primary" />
          </h1>
          <p className="text-primary-foreground/80 text-sm md:text-base mt-1">
            Cùng nhau lên kế hoạch, mơ ước và lưu giữ kỷ niệm.
          </p>
        </div>

        <label className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
          Đổi ảnh
          <input type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
        </label>
      </motion.div>

      {/* Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {widgets.map((w, i) => (
          <motion.div key={w.label} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Link to={w.path} className="card-warm p-4 md:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform">
              <w.icon className={`h-5 w-5 ${w.color}`} />
              <span className="text-xs text-muted-foreground">{w.label}</span>
              <span className="text-xl md:text-2xl font-semibold">{w.value}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Notice Panel */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="card-warm p-5 md:p-6">

        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold">Thông báo & Nhắc việc</h2>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={newNotice}
            onChange={e => setNewNotice(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addNotice()}
            placeholder="Thêm lời nhắc nhanh..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
          />

          <button
            onClick={addNotice}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {notices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có lời nhắc nào. Hãy thêm một cái!
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notices.map(n => (
              <div key={n.id} className="flex items-start gap-3 bg-muted/50 rounded-xl px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(n.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
}