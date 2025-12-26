import { Response } from "express";
import { db } from "../../db/index";
import { users } from "../../db/schemas/userSchema";
import { eq } from "drizzle-orm";
import { AuthenticationRequest } from "../../middlewares/checkAuthenticatedUsers";

export const verifyUser = async (req: AuthenticationRequest, res: Response) => {
  const { userId, action } = req.body;

  if (!["accepted", "rejected"].includes(action)) {
    return res.status(400).json({ message: "You cannot proceed further" });
  }

  try {
    await db.update(users).set({ status: action }).where(eq(users.id, userId));
    res.send(200).json({ message: `User status updated to ${action}` });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
