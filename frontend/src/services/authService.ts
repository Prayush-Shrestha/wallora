import { apiClient } from "./api";
import { User, AuthResponse } from "../types/user";

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient<{ success: boolean; data: AuthResponse }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (typeof window !== "undefined" && res.data.token) {
    localStorage.setItem("wallora_token", res.data.token);
    localStorage.setItem("wallora_user", JSON.stringify(res.data.user));
  }

  return res.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient<{ success: boolean; data: AuthResponse }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (typeof window !== "undefined" && res.data.token) {
    localStorage.setItem("wallora_token", res.data.token);
    localStorage.setItem("wallora_user", JSON.stringify(res.data.user));
  }

  return res.data;
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await apiClient<{ success: boolean; data: { user: User } }>("/auth/me");
    if (res.data.user && typeof window !== "undefined") {
      localStorage.setItem("wallora_user", JSON.stringify(res.data.user));
    }
    return res.data.user;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wallora_token");
    localStorage.removeItem("wallora_user");
  }
}

export function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    try {
      const user = localStorage.getItem("wallora_user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  return null;
}
