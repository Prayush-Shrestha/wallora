import { Response, NextFunction } from "express";
import * as adminService from "../services/adminService";
import { AuthRequest } from "../types";

export async function getStats(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ success: true, data: await adminService.getStats() });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q, role, status, plan, page, limit } = req.query;
    res.json({
      success: true,
      data: await adminService.listUsers({
        q: q as string,
        role: role as string,
        status: status as string,
        plan: plan as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      }),
    });
  } catch (err) {
    next(err);
  }
}

export async function patchUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // Prevent admins from removing their own admin role or suspending themselves
    if (req.params.id === req.user!.id) {
      const { role, status } = req.body;
      if (role === "USER" || status === "SUSPENDED") {
        res.status(400).json({ success: false, error: "You cannot demote or suspend your own account." });
        return;
      }
    }
    res.json({
      success: true,
      data: { user: await adminService.updateUser(req.params.id, req.body) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getSubscriptions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, plan, page, limit } = req.query;
    res.json({
      success: true,
      data: await adminService.listSubscriptions({
        status: status as string,
        plan: plan as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      }),
    });
  } catch (err) {
    next(err);
  }
}

export async function postSubscription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, planSlug } = req.body;
    if (!email || !planSlug) {
      res.status(400).json({ success: false, error: "email and planSlug are required." });
      return;
    }
    res.status(201).json({
      success: true,
      data: { subscription: await adminService.grantSubscription(email, planSlug) },
    });
  } catch (err) {
    next(err);
  }
}

export async function patchSubscription(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({
      success: true,
      data: { subscription: await adminService.updateSubscription(req.params.id, req.body) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, page, limit } = req.query;
    res.json({
      success: true,
      data: await adminService.listPayments({
        status: status as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      }),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPlans(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ success: true, data: { plans: await adminService.listPlans() } });
  } catch (err) {
    next(err);
  }
}

export async function postPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json({
      success: true,
      data: { plan: await adminService.createPlan(req.body) },
    });
  } catch (err) {
    next(err);
  }
}

export async function patchPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({
      success: true,
      data: { plan: await adminService.updatePlan(req.params.id, req.body) },
    });
  } catch (err) {
    next(err);
  }
}
