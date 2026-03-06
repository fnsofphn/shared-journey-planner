import { useState } from "react";
import { CalendarDays, Wallet, Image, StickyNote, Bell, Plus, Heart, Video } from "lucide-react";
import { motion } from "framer-motion";
import { store, NoticeItem, generateId } from "@/lib/store";
import heroDefault from "@/assets/hero-default.jpg";
import { Link } from "react-router-dom";

export default function Dashboard() {

  const [heroImg, setHeroImg] = useState(store.getHeroImage() || heroDefault);
  const [notices, setNotices] = useState<NoticeItem[]>(store.getNotices());
  const [newNotice, setNewNotice] = useState("");

  const appointments = store.getAppointments();
  const transactions = store.getTransactions();
  const photos = store.getPhotos();
  const notes = store.getNotes();
  const contents = store.getContents?.() || [];

  const totalFund = transactions.reduce(
    (s, t) => s + (t.type === "income" ? t.amount : -t.amount),
    0
  );

  const upcoming = appointments
    .filter(a => new Date(a.date) >= new Date())
    .slice(0, 3);

  const addNotice = () => {
    if (!newNotice.trim()) return;
    const updated = [
      { id: generateId(), text: newNotice, date: new Date().toISOString() },
      ...notices
    ];
    setNotices(updated);
    store.setNotices(updated);
    setNewNotice("");
  };

  const widgets = [
    { icon: CalendarDays, label: "Việc cần làm", value: appointments.length, path: "/calendar" },
    { icon: Wallet, label: "Tổng quỹ", value: `${totalFund.toLocaleString()}₫`, path: "/finance" },
    { icon: Image, label: "Ảnh kỷ niệm", value: photos.length, path: "/album" },
    { icon: StickyNote, label: "Ghi chú", value: notes.length, path: "/notes" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

      {/* HERO */}
      <div className="relative rounded-3xl overflow-hidden h-64">

        <img src={heroImg} className="w-full h-full object-cover"/>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 via-purple-700/70 to-cyan-500/60"/>

        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            Journey Dashboard <Heart className="fill-white"/>
          </h1>
          <p className="opacity-80">Plan • Create • Capture Memories</p>
        </div>

      </div>

      {/* WIDGETS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {widgets.map((w, i) => (

          <Link key={i} to={w.path}>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-5 rounded-2xl text-white
              bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-400
              shadow-xl"
            >

              <w.icon className="mb-2"/>

              <p className="text-sm opacity-80">{w.label}</p>

              <p className="text-2xl font-bold">{w.value}</p>

            </motion.div>

          </Link>

        ))}

      </div>

      {/* UPCOMING TODO */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">

        <h2 className="text-lg font-semibold mb-3">Việc sắp tới</h2>

        {upcoming.length === 0 && <p className="opacity-70">Chưa có lịch</p>}

        {upcoming.map(a => (
          <div key={a.id} className="flex justify-between py-2 border-b border-white/10">
            <span>{a.title}</span>
            <span className="opacity-70 text-sm">
              {new Date(a.date).toLocaleDateString()}
            </span>
          </div>
        ))}

      </div>

      {/* CONTENT TIMELINE */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6">

        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Video size={18}/> Timeline Content
        </h2>

        {contents.slice(0,3).map(c => (
          <div key={c.id} className="py-2 border-b border-white/10">
            {c.title}
          </div>
        ))}

      </div>

      {/* PHOTO PREVIEW */}
      <div className="grid grid-cols-3 gap-3">

        {photos.slice(0,3).map(p => (
          <img
            key={p.id}
            src={p.url}
            className="rounded-xl object-cover h-28 w-full"
          />
        ))}

      </div>

    </div>
  );
}
