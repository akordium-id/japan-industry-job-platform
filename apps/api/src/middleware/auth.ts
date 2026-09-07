import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@jijp/types";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
    };
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session?.user) {
    res.status(401).json({
      success: false,
      error: "Unauthorized. Silakan login terlebih dahulu.",
      code: "UNAUTHORIZED",
    });
    return;
  }
  next();
}

export function requireRole(
  ...roles: UserRole[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.session?.user) {
      res.status(401).json({
        success: false,
        error: "Unauthorized.",
        code: "UNAUTHORIZED",
      });
      return;
    }
    if (!roles.includes(req.session.user.role)) {
      res.status(403).json({
        success: false,
        error: "Akses ditolak.",
        code: "FORBIDDEN",
      });
      return;
    }
    next();
  };
}
