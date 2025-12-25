import { Response } from "express";
import { db } from "../../db/index";
import { and, eq, is } from "drizzle-orm";
import { properties, roommate } from "../../db/schema";
import fs from "fs";

export const updateProperty = async (req: any, res: Response) => {
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
      return res.status(401).json({ message: "Property not found" });
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
      let newUrl = existing.imageUrl;
      if (req.file) {
        if (fs.existsSync(existing.imageUrl!)) {
          fs.unlinkSync(existing.imageUrl!);
        }

        newUrl = req.file.path;
      }

      await tx
        .update(properties)
        .set({
          title,
          description,
          price,
          address,
          type,
          imageUrl: newUrl,
          beds: parseInt(beds),
          baths: parseInt(baths),
          isRoommateOption: isRoommateOption === "false",
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
          isSmoker: isSmoker === "false",
          hasPets: hasPets === "false",
          age,
          gender,
          prefMinAge: parseInt(prefMinAge),
          prefMaxAge: parseInt(prefMaxAge),
          prefGender,
        });
      } else {
        await tx.delete(roommate).where(eq(roommate.propertyId, propertyId));
      }
    });
  } catch (e: any) {
    res
      .status(400)
      .json({ message: "cannot update the property", error: e.message });
  }
};
