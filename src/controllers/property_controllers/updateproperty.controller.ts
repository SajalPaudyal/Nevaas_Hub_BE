import { Response } from "express";
import { db } from "../../db/index";
import { and, eq, is } from "drizzle-orm";
import { properties, roommate } from "../../db/schema";
import fs from "fs";
import path from "path";

export const updateProperty = async (req: any, res: Response) => {
  let newFilePath: string | null = null;
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
      return res.status(404).json({ message: "Property not found" });
    }

    const {
      title,
      description,
      price,
      address,
      beds,
      baths,
      type,
      isRoommateOption,
    } = req.body;

    await db.transaction(async (tx) => {
      let finalImageUrl = existing.imageUrl;

      if (req.file) {
        const folder = "uploads/properties";
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.extname(req.file.originalname)}`;
        newFilePath = path.join(folder, uniqueName);

        fs.writeFileSync(newFilePath, req.file.buffer);
        finalImageUrl = newFilePath;

        if (existing.imageUrl && fs.existsSync(existing.imageUrl)) {
          fs.unlinkSync(existing.imageUrl);
        }
      }

      await tx
        .update(properties)
        .set({
          title,
          description,
          price,
          address,
          type,
          imageUrl: finalImageUrl,
          beds: parseInt(beds),
          baths: parseInt(baths),
          isRoommateOption: isRoommateOption === "true",
        })
        .where(eq(properties.id, propertyId));

      if (isRoommateOption === "true") {
        const {
          occupation,
          education,
          faculty,
          isSmoker,
          hasPets,
          prefMaxAge,
          prefMinAge,
          prefGender,
          age,
          gender,
        } = req.body;

        await tx.delete(roommate).where(eq(roommate.propertyId, propertyId));
        await tx.insert(roommate).values({
          propertyId,
          occupation,
          education,
          faculty,
          age: parseInt(age),
          gender,
          isSmoker: isSmoker === "true",
          hasPets: hasPets === "true",
          prefMinAge: parseInt(prefMinAge),
          prefMaxAge: parseInt(prefMaxAge),
          prefGender,
        });
      } else {
        await tx.delete(roommate).where(eq(roommate.propertyId, propertyId));
      }
    });

    res.status(200).json({ message: "Property updated successfully" });
  } catch (e: any) {
    if (newFilePath && fs.existsSync(newFilePath)) {
      fs.unlinkSync(newFilePath);
    }
    res
      .status(400)
      .json({ message: "Cannot update property", error: e.message });
  }
};
