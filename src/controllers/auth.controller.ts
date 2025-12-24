import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const register = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "National Identification Required" });
    }

    const { fullName, email, password } = req.body;

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existing) {
      return res
        .status(400)
        .json({
          message:
            "User with the email id is already registered. Please try signing in.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      fullName,
      email: email,
      password: hashedPassword,
      idDocumentPath: req.file?.path,
    });

    res.status(200).json({message:"New user successfully registered"})

    
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
