import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { DashboardPage } from "./pages/dashboard-page";

export function App() { const [theme, setTheme] = useState<"light" | "dark">(() => localStorage.theme === "dark" ? "dark" : "light"); useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); localStorage.theme = theme; }, [theme]); return <AppShell theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}><DashboardPage /></AppShell>; }
