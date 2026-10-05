import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { AuthPage } from "./pages/auth-page";
import { DashboardPage } from "./pages/dashboard-page";
import { authApi, type AuthUser } from "./services/auth";

export function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => localStorage.theme === "dark" ? "dark" : "light"); const [user, setUser] = useState<AuthUser | null>(null); const [mode, setMode] = useState<"login" | "register">("login");
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); localStorage.theme = theme; }, [theme]);
  async function authenticate(input: { name: string; email: string; password: string }) { const result = mode === "register" ? await authApi.register(input) : await authApi.login(input); setUser(result.user); }
  if (!user) return <AuthPage mode={mode} onSwitch={() => setMode(mode === "login" ? "register" : "login")} onSubmit={authenticate} />;
  return <AppShell theme={theme} onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}><DashboardPage /></AppShell>;
}
