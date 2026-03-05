import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ListTodo,
  Wallet,
  StickyNote,
  Image,
  BookOpen,
  FileText,
  Menu,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Trang chủ", icon: LayoutDashboard, path: "/" },
  { label: "Lịch chung", icon: CalendarDays, path: "/calendar" },
  { label: "Hoạt động", icon: ListTodo, path: "/activities" },
  { label: "Tài chính", icon: Wallet, path: "/finance" },
  { label: "Ghi chú", icon: StickyNote, path: "/notes" },
  { label: "Album ảnh", icon: Image, path: "/album" },
  { label: "Nội dung", icon: BookOpen, path: "/content" },
  { label: "Thỏa thuận", icon: FileText, path: "/contracts" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-background">

      {/* Sidebar Desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-sidebar transition-all duration-300 sticky top-0 h-screen",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Menu className="h-5 w-5 text-sidebar-foreground" />
          </button>

          {sidebarOpen && (
            <div className="flex items-center gap-1.5">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <span className="font-display font-semibold text-lg text-sidebar-foreground">
                Hành Trình Của Chúng Ta
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Menu dưới Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
        <div className="flex justify-around items-center py-1.5">
          {navItems.slice(0, 5).map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-xs transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "drop-shadow-sm")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            to="/album"
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-xs transition-colors",
              ["/album", "/content", "/contracts"].includes(location.pathname)
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <BookOpen className="h-5 w-5" />
            <span>Thêm</span>
          </Link>
        </div>
      </nav>

    </div>
  );
}