import { Response } from "express";
import { db } from "../../db/index";
import { properties, roommate } from "../../db/schema";
import fs from "fs";
import path from "path";
import { AuthenticationRequest } from "../../middlewares/checkAuthenticatedUsers";

export const createProperty = async (
  req: AuthenticationRequest,
  res: Response
) => {
  let propertyPath: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Property image is needed." });
    }

    const ownerId = req.user?.id;
    const userStatus = req.user?.status;

    if (!ownerId) {
      return res
        .status(401)
        .json({ message: "You need to sign in to add a property." });
    }

    if (userStatus !== "accepted") {
      return res.status(403).json({
        message: "Please wait, your account is pending admin approval.",
      });
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

    const folder = "uploads/properties";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const propertyName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(req.file.originalname)}`;
    propertyPath = path.join(folder, propertyName);

    fs.writeFileSync(propertyPath, req.file.buffer);

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
        isRoommateOption: isRoommateOption === "true",
        imageUrl: propertyPath!,
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
          age: parseInt(age),
          gender,
          faculty: faculty || "Others",
          isSmoker: isSmoker === "true",
          hasPets: hasPets === "true",
          prefMinAge: parseInt(prefMinAge),
          prefMaxAge: parseInt(prefMaxAge),
        });
      }
    });

    res.status(201).json({ message: "Property added successfully." });
  } catch (e: any) {
    if (propertyPath && fs.existsSync(propertyPath)) {
      fs.unlinkSync(propertyPath);
    }

    console.error("Creation Error:", e);
    res.status(400).json({
      message: "Could not create property.",
      error: e.message,
    });
  }
};
