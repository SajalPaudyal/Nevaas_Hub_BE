import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { db } from "../db/index";
import { users } from "../db/schemas/userSchema";
import { eq } from "drizzle-orm";

export interface AuthenticationRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "user" | "admin";
    status: "pending" | "accepted" | "rejected";
  };
}

export const checkAuthenticatedUsers = async (
  req: any,
  res: any,
  next: any
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user) {
      return res.status(404).json({ message: "User no longer exists" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
