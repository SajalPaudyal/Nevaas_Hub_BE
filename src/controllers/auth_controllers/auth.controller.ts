import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../../db/index";
import { users } from "../../db/schema";
import { eq, or } from "drizzle-orm";
import fs from "fs";
import path from "path";

export const register = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "National Identification Required" });
    }

    const { fullName, email, password, phone } = req.body;

    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 10 digits." });
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)));

    if (existing) {
      return res.status(400).json({
        message:
          "User with the email id or phone number is already registered. Please try signing in.",
      });
    }

    const folder = "uploads/id_documents";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(req.file.originalname)}`;

    const filePath = path.join(folder, uniqueFileName);

    const hashedPassword = await bcrypt.hash(password, 12);

    fs.writeFileSync(filePath, req.file.buffer);

    await db.insert(users).values({
      fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
      idDocumentPath: filePath,
    });

    res.status(200).json({ message: "New user successfully registered" });
  } catch (e: any) {
    console.error("RAW ERROR:", e.message);
    res.status(500).json({ message: e.message });
  }
};
