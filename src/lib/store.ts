// Simple localStorage-based store for all modules

export interface Activity {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  category: "travel" | "food" | "entertainment" | "goal";
  status: "planned" | "in-progress" | "completed";
  createdAt: string;
}

export interface Appointment {
  id: string;
  name: string;
  date: string;
  description: string;
  activityIds: string[];
  notes: string;
  photos: string[];
  totalCost: number;
}

export interface Note {
  id: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  appointmentId?: string;
}

export interface ContentItem {
  id: string;
  type: "book" | "movie" | "music";
  title: string;
  link: string;
  notes: string;
  status: "planned" | "completed";
}

export interface Contract {
  id: string;
  partyA: string;
  partyB: string;
  jobDescription: string;
  duration: string;
  terms: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  description: string;
  category: string;
  appointmentId?: string;
}

export interface NoticeItem {
  id: string;
  text: string;
  date: string;
}

function load<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const store = {
  getActivities: () => load<Activity[]>("activities", []),
  setActivities: (d: Activity[]) => save("activities", d),

  getAppointments: () => load<Appointment[]>("appointments", []),
  setAppointments: (d: Appointment[]) => save("appointments", d),

  getNotes: () => load<Note[]>("notes", []),
  setNotes: (d: Note[]) => save("notes", d),

  getPhotos: () => load<Photo[]>("photos", []),
  setPhotos: (d: Photo[]) => save("photos", d),

  getContent: () => load<ContentItem[]>("content", []),
  setContent: (d: ContentItem[]) => save("content", d),

  getContracts: () => load<Contract[]>("contracts", []),
  setContracts: (d: Contract[]) => save("contracts", d),

  getTransactions: () => load<Transaction[]>("transactions", []),
  setTransactions: (d: Transaction[]) => save("transactions", d),

  getNotices: () => load<NoticeItem[]>("notices", []),
  setNotices: (d: NoticeItem[]) => save("notices", d),

  getHeroImage: () => load<string | null>("heroImage", null),
  setHeroImage: (url: string | null) => save("heroImage", url),
};

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
