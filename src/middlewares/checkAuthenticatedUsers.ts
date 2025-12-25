import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export interface AuthenticationRequest extends Request {
  user?: { id: number; email: string };
}

export const checkAuthenticatedUsers = (
  req: AuthenticationRequest,
  res: Response,
  next: NextFunction
) => {
  const authenticationHeader = req.headers["authorization"];
  const token = authenticationHeader && authenticationHeader.split(" ")[1];
  if (!token) {
    return res
      .status(400)
      .json({ message: "Cannot authenticate. Invalid token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (e: any) {
    res.status(400).json({ message: "Cannot authenticate. Invalid token." });
  }
};
