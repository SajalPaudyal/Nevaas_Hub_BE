import { Request, Response } from "express";
import { db } from "../../db";
import { roommate } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import fs from "fs";

export const deleteRoommateOpening = async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db
      .select()
      .from(roommate)
      .where(and(eq(roommate.id, id), eq(roommate.ownerId, req.user?.id)));

    if (!existing) {
      return res
        .status(404)
        .json({ message: "could not find the roommate opening with this id" });
    }

    await db.delete(roommate).where(eq(roommate.id, id));

    if (existing.imageUrl && fs.existsSync(existing.imageUrl)) {
      fs.unlinkSync(existing.imageUrl);
    }

    res
      .status(200)
      .json({ message: "Roommate vacancy opening deleted successfully." });
  } catch (e: any) {
    res.status(500).json({
      message: "could not delete the roommate opening",
      error: e.message,
    });
  }
};
