import { Response } from "express";
import { db } from "../../db/index";
import { properties } from "../../db/schema";
import { roommate } from "../../db/schema";
import { AuthenticationRequest } from "../../middlewares/checkAuthenticatedUsers";

export const createProperty = async (
  req: AuthenticationRequest,
  res: Response
) => {
  console.log("Headers:", req.headers.authorization);
  console.log("User Object:", req.user);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Property image is needed." });
    }

    const {
      title,
      description,
      price,
      address,
      beds,
      baths,
      type,
      latitude,
      longitude,
      isRoommateOption,
    } = req.body;
    const ownerId = req.user?.id;

    const imageUrl = req.file.path;

    if (!ownerId) {
      return res.status(401).json({ message: "You need to sign in to....." });
    }

    await db.transaction(async (tx) => {
      const [newProp] = await tx.insert(properties).values({
        ownerId,
        title,
        description,
        price,
        address,
        beds: parseInt(beds),
        baths: parseInt(baths),
        type,
        latitude,
        longitude,
        isRoommateOption: isRoommateOption == "false",
        imageUrl,
      });

      if (isRoommateOption === "true") {
        const {
          occupation,
          age,
          gender,
          faculty,
          education,
          isSmoker,
          hasPets,
          prefMinAge,
          prefMaxAge,
        } = req.body;
        await tx.insert(roommate).values({
          propertyId: newProp.insertId,
          occupation,
          education,
          age,
          gender,
          faculty: faculty || "Others",
          isSmoker: isSmoker === "false",
          hasPets: hasPets === "false",
          prefMinAge,
          prefMaxAge,
        });
      }
    });
    res.status(201).json({ message: "Property added successfully." });
  } catch (e: any) {
    res.status(400).json({
      message: "Could not crete a property. Please be properly authenticated.",
      error: e.message,
    });
  }
};
