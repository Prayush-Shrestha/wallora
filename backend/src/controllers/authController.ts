import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { validateRegister, validateLogin } from "../utils/validation";
import { AuthRequest } from "../types";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validationError = validateRegister(req.body);
    if (validationError) {
      res.status(400).json({ success: false, error: validationError });
      return;
    }

    const { name, email, password } = req.body;
    const result = await authService.register(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validationError = validateLogin(req.body);
    if (validationError) {
      res.status(400).json({ success: false, error: validationError });
      return;
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: "Logged in successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getUserProfile(req.user!.id);
    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}
