import { apiClient } from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  role: string;
  status: string;
  lastLoginAt?: string | null;
  createdAt: string;
  _count: { favorites: number; downloads: number; aiWallpapers: number; wallpapers: number };
  subscriptions: {
    id: string;
    status: string;
    currentPeriodEnd?: string;
    plan: { id: string; name: string; slug: string; priceCents: number };
  }[];
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  status: string;
  provider: string;
  currentPeriodEnd?: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  plan: Plan;
}

export interface Payment {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  plan?: { name: string };
}

export interface AdminStats {
  totals: {
    users: number;
    newUsers7d: number;
    activeSubscriptions: number;
    wallpapers: number;
    downloads: number;
    aiGenerations: number;
    favorites: number;
    revenueCents30d: number;
    revenueCentsAllTime: number;
    totalPayments: number;
    paidUsers: number;
    freeUsers: number;
  };
  signupsByDay: Record<string, number>;
  revenueByDay: Record<string, number>;
  recentUsers: AdminUser[];
  recentPayments: Payment[];
  topBuyers: { user: { id: string; name: string; email: string }; totalCents: number; payments: number }[];
  topActiveUsers: (AdminUser & { activityScore: number })[];
  planBreakdown: { id: string; name: string; slug: string; priceCents: number; activeSubscribers: number }[];
}

function qs(params: Record<string, string | number | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiClient<{ success: boolean; data: AdminStats }>("/admin/stats");
  return res.data;
}

export async function fetchAdminUsers(params: {
  q?: string;
  role?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
}) {
  const res = await apiClient<{
    success: boolean;
    data: { users: AdminUser[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
  }>(`/admin/users${qs(params)}`);
  return res.data;
}

export async function updateAdminUser(id: string, data: { role?: string; status?: string }) {
  const res = await apiClient<{ success: boolean; data: { user: AdminUser } }>(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function fetchAdminSubscriptions(params: { status?: string; plan?: string; page?: number; limit?: number }) {
  const res = await apiClient<{
    success: boolean;
    data: { subscriptions: Subscription[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
  }>(`/admin/subscriptions${qs(params)}`);
  return res.data;
}

export async function grantSubscription(email: string, planSlug: string) {
  const res = await apiClient<{ success: boolean; data: { subscription: Subscription } }>("/admin/subscriptions", {
    method: "POST",
    body: JSON.stringify({ email, planSlug }),
  });
  return res.data;
}

export async function updateSubscription(id: string, status: string) {
  const res = await apiClient<{ success: boolean; data: { subscription: Subscription } }>(`/admin/subscriptions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return res.data;
}

export async function fetchAdminPayments(params: { status?: string; page?: number; limit?: number }) {
  const res = await apiClient<{
    success: boolean;
    data: { payments: Payment[]; revenueCents: number; pagination: { total: number; page: number; limit: number; totalPages: number } };
  }>(`/admin/payments${qs(params)}`);
  return res.data;
}

export async function fetchAdminPlans(): Promise<{ plans: Plan[] }> {
  const res = await apiClient<{ success: boolean; data: { plans: Plan[] } }>("/admin/plans");
  return res.data;
}

export async function createPlan(data: { name: string; slug: string; description?: string; priceCents: number; interval?: string; features?: string[] }) {
  const res = await apiClient<{ success: boolean; data: { plan: Plan } }>("/admin/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updatePlan(id: string, data: { name?: string; description?: string; priceCents?: number; isActive?: boolean; features?: string[] }) {
  const res = await apiClient<{ success: boolean; data: { plan: Plan } }>(`/admin/plans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}
