import { Bell, BookOpen, Brain, FileText, LayoutDashboard, MessageSquare, Moon, Search, Settings, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

const links = [
  [LayoutDashboard, "Dashboard"], [MessageSquare, "AI Chat"], [FileText, "Notes"], [BookOpen, "Flashcards"], [Brain, "Quizzes"], [Search, "Search"],
] as const;

export function AppShell({ children, theme, onThemeToggle }: { children: ReactNode; theme: "light" | "dark"; onThemeToggle: () => void }) {
  return <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
    <aside className="fixed inset-y-0 hidden w-60 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 md:block">
      <div className="mb-9 flex items-center gap-2 px-2 text-lg font-semibold"><span className="grid h-7 w-7 place-items-center rounded-md bg-zinc-950 text-xs text-white dark:bg-zinc-50 dark:text-zinc-950">V</span>VEONIX</div>
      <nav className="space-y-1">{links.map(([Icon, label], index) => <button key={label} className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${index === 0 ? "bg-zinc-200 font-medium dark:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"}`}><Icon size={17} />{label}</button>)}</nav>
      <div className="absolute inset-x-4 bottom-4"><button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"><Settings size={17} />Settings</button></div>
    </aside>
    <main className="md:pl-60"><header className="flex h-16 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800"><div className="font-medium md:hidden">VEONIX</div><div className="hidden text-sm text-zinc-500 md:block">Your learning workspace</div><div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label="Toggle color theme" onClick={onThemeToggle}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</Button><Button variant="ghost" size="icon" aria-label="Notifications"><Bell size={18} /></Button><div className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">S</div></div></header>{children}</main>
  </div>;
}
