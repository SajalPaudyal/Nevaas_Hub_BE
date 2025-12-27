import { Request, Response } from "express";
import { db } from "../../db";
import { roommate } from "../../db/schema";
import { desc, eq, and } from "drizzle-orm";
import fs from "fs";
import path from "path";

export const updateRoommateOpening = async (req: any, res: Response) => {
  let photoPath: string | null = null;

  try {
    const id = parseInt(req.params.id);
    const [existing] = await db
      .select()
      .from(roommate)
      .where(and(eq(roommate.id, id), eq(roommate.ownerId, req.user?.id)));

    if (!existing) {
      return res
        .status(401)
        .json({ message: "could not find the roommate vacancy with this id" });
    }

    const body = req.body || {};
    let finalImage = existing.imageUrl;

    if (req.file) {
      const folder = "uploads/roommates";

      if (fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      photoPath = path.join(
        folder,
        `${Date.now()}${path.extname(req.file.originalname)}`
      );
      fs.writeFileSync(photoPath, req.file.buffer);
      finalImage = photoPath;

      if (existing.imageUrl && fs.existsSync(existing.imageUrl)) {
        fs.unlinkSync(existing.imageUrl);
      }
    }

    await db
      .update(roommate)
      .set({
        title: body.title,
        description: body.description,
        price: body.price,
        address: body.address,
        occupation: body.occupation,
        age: body.age ? parseInt(body.age) : undefined,
        beds: body.beds ? parseInt(body.beds) : undefined,
        baths: body.baths ? parseInt(body.baths) : undefined,
        isSmoker:
          body.isSmoker !== undefined ? body.isSmoker === "true" : undefined,
        hasPets:
          body.hasPets !== undefined ? body.hasPets === "true" : undefined,
        imageUrl: finalImage,
      })
      .where(eq(roommate.id, id));

    res.status(200).json({ message: "Roommate vacancy updated successfully" });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
