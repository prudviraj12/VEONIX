const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export type AuthUser = { id: string; email: string; name: string | null };
type AuthResponse = { user: AuthUser; accessToken: string };

async function request(path: string, body?: object): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/${path}`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Something went wrong");
  return data as AuthResponse;
}

export const authApi = {
  register: (input: { name: string; email: string; password: string }) => request("register", input),
  login: (input: { email: string; password: string }) => request("login", input),
  refresh: () => request("refresh"),
  logout: async () => { await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }); },
};
