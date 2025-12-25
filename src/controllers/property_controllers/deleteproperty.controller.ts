import { Response } from "express";
import { db } from "../../db/index";
import { and, eq, is } from "drizzle-orm";
import { properties, roommate } from "../../db/schema";
import fs from "fs";

export const deleteProperty = async (req: any, res: Response) => {
  try {
    const propertyId = parseInt(req.params.id);
    const userId = req.user?.id;

    const [existing] = await db
      .select()
      .from(properties)
      .where(
        and(eq(properties.id, propertyId), eq(properties.ownerId, userId!))
      );

    if (!existing) {
      return res
        .status(401)
        .json({ message: "could not find the property with this id" });
    }

    await db.delete(properties).where(eq(properties.id, propertyId));

    if (existing.imageUrl && fs.existsSync(existing.imageUrl)) {
      fs.unlinkSync(existing.imageUrl);
    }

    res.status(200).json({ message: `property deleted` });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};
