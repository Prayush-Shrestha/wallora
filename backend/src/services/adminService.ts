import prisma from "../config/database";

const userWithActivity = {
  id: true,
  name: true,
  email: true,
  profileImage: true,
  role: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  _count: { select: { favorites: true, downloads: true, aiWallpapers: true, wallpapers: true } },
  subscriptions: {
    where: { status: "ACTIVE" },
    select: {
      id: true,
      status: true,
      currentPeriodEnd: true,
      plan: { select: { id: true, name: true, slug: true, priceCents: true } },
    },
    take: 1,
  },
};

export async function getStats() {
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsers7d,
    activeSubscriptions,
    wallpapers,
    downloads,
    aiGenerations,
    totalFavorites,
    signups,
    payments,
    recentUsers,
    recentPayments,
    allTimeRevenue,
    totalPayments,
    paidUsers,
    plansWithCounts,
    buyerGroups,
    activeCandidates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: since7d } } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.wallpaper.count(),
    prisma.download.count(),
    prisma.aIWallpaper.count(),
    prisma.favorite.count(),
    prisma.user.findMany({
      where: { createdAt: { gte: since30d } },
      select: { createdAt: true },
    }),
    prisma.payment.findMany({
      where: { status: "COMPLETED", createdAt: { gte: since30d } },
      select: { amountCents: true, createdAt: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: userWithActivity,
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { name: true } },
      },
    }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amountCents: true },
    }),
    prisma.payment.count(),
    prisma.user.count({ where: { subscriptions: { some: { status: "ACTIVE" } } } }),
    prisma.plan.findMany({
      orderBy: { priceCents: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        priceCents: true,
        _count: { select: { subscriptions: { where: { status: "ACTIVE" } } } },
      },
    }),
    // Who bought — top spenders of all time
    prisma.payment.groupBy({
      by: ["userId"],
      where: { status: "COMPLETED" },
      _sum: { amountCents: true },
      _count: { id: true },
      orderBy: { _sum: { amountCents: "desc" } },
      take: 5,
    }),
    // Who uses — candidates for most active (sorted in JS by total activity)
    prisma.user.findMany({
      take: 30,
      orderBy: { downloads: { _count: "desc" } },
      select: userWithActivity,
    }),
  ]);

  // Resolve top buyer identities
  const buyerUsers = buyerGroups.length
    ? await prisma.user.findMany({
        where: { id: { in: buyerGroups.map((g) => g.userId) } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const buyerById = new Map(buyerUsers.map((u) => [u.id, u]));
  const topBuyers = buyerGroups.map((g) => ({
    user: buyerById.get(g.userId) || { id: g.userId, name: "Unknown", email: "" },
    totalCents: g._sum.amountCents || 0,
    payments: g._count.id,
  }));

  // Who uses — rank by favorites + downloads + AI generations
  const topActiveUsers = [...activeCandidates]
    .map((u: any) => ({
      ...u,
      activityScore: (u._count?.favorites || 0) + (u._count?.downloads || 0) + (u._count?.aiWallpapers || 0),
    }))
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 5);

  const planBreakdown = plansWithCounts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents,
    activeSubscribers: p._count.subscriptions,
  }));

  const signupsByDay: Record<string, number> = {};
  for (const u of signups) {
    const day = u.createdAt.toISOString().slice(0, 10);
    signupsByDay[day] = (signupsByDay[day] || 0) + 1;
  }

  const revenueByDay: Record<string, number> = {};
  let revenueCents = 0;
  for (const p of payments) {
    revenueCents += p.amountCents;
    const day = p.createdAt.toISOString().slice(0, 10);
    revenueByDay[day] = (revenueByDay[day] || 0) + p.amountCents;
  }

  return {
    totals: {
      users: totalUsers,
      newUsers7d,
      activeSubscriptions,
      wallpapers,
      downloads,
      aiGenerations,
      favorites: totalFavorites,
      revenueCents30d: revenueCents,
      revenueCentsAllTime: allTimeRevenue._sum.amountCents || 0,
      totalPayments,
      paidUsers,
      freeUsers: totalUsers - paidUsers,
    },
    signupsByDay,
    revenueByDay,
    recentUsers,
    recentPayments,
    topBuyers,
    topActiveUsers,
    planBreakdown,
  };
}

export interface UserListFilters {
  q?: string;
  role?: string;
  status?: string;
  plan?: string; // "free" | "paid"
  page?: number;
  limit?: number;
}

export async function listUsers(filters: UserListFilters) {
  const { q, role, status, plan, page = 1, limit = 20 } = filters;
  const where: any = {};

  if (q && q.trim()) {
    const search = q.trim();
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role && role !== "all") where.role = role;
  if (status && status !== "all") where.status = status;
  if (plan === "paid") {
    where.subscriptions = { some: { status: "ACTIVE" } };
  } else if (plan === "free") {
    where.subscriptions = { none: { status: "ACTIVE" } };
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: userWithActivity,
    }),
  ]);

  return { users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function updateUser(id: string, data: { role?: string; status?: string }) {
  if (data.role && !["USER", "ADMIN"].includes(data.role)) {
    const error: any = new Error("Role must be USER or ADMIN.");
    error.statusCode = 400;
    throw error;
  }
  if (data.status && !["ACTIVE", "SUSPENDED"].includes(data.status)) {
    const error: any = new Error("Status must be ACTIVE or SUSPENDED.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.user.update({
    where: { id },
    data: {
      ...(data.role ? { role: data.role } : {}),
      ...(data.status ? { status: data.status } : {}),
    },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
}

export async function listSubscriptions(filters: { status?: string; plan?: string; page?: number; limit?: number }) {
  const { status, plan, page = 1, limit = 20 } = filters;
  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (plan && plan !== "all") where.plan = { slug: plan };

  const [total, subscriptions] = await Promise.all([
    prisma.subscription.count({ where }),
    prisma.subscription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
    }),
  ]);

  return { subscriptions, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function grantSubscription(userEmail: string, planSlug: string) {
  const user = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase().trim() } });
  if (!user) {
    const error: any = new Error("No user found with that email.");
    error.statusCode = 404;
    throw error;
  }

  const plan = await prisma.plan.findUnique({ where: { slug: planSlug } });
  if (!plan || !plan.isActive) {
    const error: any = new Error("Plan not found or inactive.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.subscription.updateMany({
    where: { userId: user.id, status: "ACTIVE" },
    data: { status: "CANCELED" },
  });

  const periodEnd =
    plan.interval === "MONTH"
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : plan.interval === "YEAR"
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : null;

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: plan.id,
      status: "ACTIVE",
      provider: "MANUAL",
      currentPeriodEnd: periodEnd,
    },
    include: { plan: true, user: { select: { id: true, name: true, email: true } } },
  });

  if (plan.priceCents > 0) {
    await prisma.payment.create({
      data: {
        userId: user.id,
        planId: plan.id,
        subscriptionId: subscription.id,
        amountCents: plan.priceCents,
        currency: plan.currency,
        status: "COMPLETED",
        provider: "MANUAL",
      },
    });
  }

  return subscription;
}

export async function updateSubscription(id: string, data: { status?: string }) {
  if (data.status && !["ACTIVE", "CANCELED", "EXPIRED", "PAST_DUE"].includes(data.status)) {
    const error: any = new Error("Invalid subscription status.");
    error.statusCode = 400;
    throw error;
  }
  return prisma.subscription.update({
    where: { id },
    data: { ...(data.status ? { status: data.status } : {}) },
    include: { plan: true, user: { select: { id: true, name: true, email: true } } },
  });
}

export async function listPayments(filters: { status?: string; page?: number; limit?: number }) {
  const { status, page = 1, limit = 20 } = filters;
  const where: any = {};
  if (status && status !== "all") where.status = status;

  const [total, payments, revenue] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: { select: { name: true } },
      },
    }),
    prisma.payment.aggregate({
      where: { ...where, status: "COMPLETED" },
      _sum: { amountCents: true },
    }),
  ]);

  return {
    payments,
    revenueCents: revenue._sum.amountCents || 0,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function listPlans() {
  return prisma.plan.findMany({ orderBy: { priceCents: "asc" } });
}

export async function createPlan(data: {
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  currency?: string;
  interval?: string;
  features?: string[];
}) {
  if (!data.name || !data.slug) {
    const error: any = new Error("Plan name and slug are required.");
    error.statusCode = 400;
    throw error;
  }
  return prisma.plan.create({
    data: {
      name: data.name,
      slug: data.slug.toLowerCase().trim(),
      description: data.description,
      priceCents: Math.max(0, Math.round(data.priceCents)),
      currency: data.currency || "USD",
      interval: data.interval || "NONE",
      features: data.features || [],
    },
  });
}

export async function updatePlan(
  id: string,
  data: { name?: string; description?: string; priceCents?: number; isActive?: boolean; features?: string[] }
) {
  return prisma.plan.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.priceCents !== undefined ? { priceCents: Math.max(0, Math.round(data.priceCents)) } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.features !== undefined ? { features: data.features } : {}),
    },
  });
}
