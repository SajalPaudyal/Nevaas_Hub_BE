import { Request, Response } from "express";
import { db } from "../../db";
import { roommate } from "../../db/schema";
import { desc, eq } from "drizzle-orm";

export const getAllRoommateOpenings = async (req: Request, res: Response) => {
  try {
    const data = await db.query.roommate.findMany({
      orderBy: [desc(roommate.id)],
    });

    res.json(data);
  } catch (e: any) {
    res
      .status(500)
      .json({ message: "Could not fetch data.", error: e.message });
  }
};

export const getSingleRoommateOpening = async (req: any, res: Response) => {
  try {
    const data = await db.query.roommate.findFirst({
      where: eq(roommate.id, parseInt(req.params.id)),
    });

    res.json(data);
  } catch (e: any) {
    res
      .status(500)
      .json({ message: "Could not fetch data.", error: e.message });
  }
};

export const getMyRoommateOpenings = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = await db
      .select()
      .from(roommate)
      .where(eq(roommate.ownerId, userId));
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
