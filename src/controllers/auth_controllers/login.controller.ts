import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { users } from "../../db/schema";
import "dotenv/config";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ message: "Invalid email of password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({
        message: "Successfully Logged In",
        token,
        user: { id: user.id, name: user.fullName },
      });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
