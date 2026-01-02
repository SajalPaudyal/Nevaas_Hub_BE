import { Response } from "express";
import { db } from "../../db/index";
import {
  propertyApplications,
  roommateApplications,
  properties,
  roommate,
} from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { AuthenticationRequest } from "../../middlewares/checkAuthenticatedUsers";

export const applyForProperty = async (
  req: AuthenticationRequest,
  res: Response
) => {
  try {
    const applicantId = req.user?.id;
    const { propertyId, message } = req.body;

    if (!applicantId)
      return res.status(401).json({ message: "Please log in to apply." });

    const [targetProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));
    if (!targetProperty)
      return res.status(404).json({ message: "Property not found." });

    if (targetProperty.ownerId === applicantId) {
      return res
        .status(400)
        .json({ message: "You cannot apply for your own property." });
    }

    const [existing] = await db
      .select()
      .from(propertyApplications)
      .where(
        and(
          eq(propertyApplications.propertyId, propertyId),
          eq(propertyApplications.applicantId, applicantId)
        )
      );
    if (existing)
      return res
        .status(400)
        .json({ message: "You have already applied for this property." });

    await db.insert(propertyApplications).values({
      propertyId,
      applicantId,
      message: message || "I am interested in this property.",
    });

    res.status(201).json({ message: "Application sent successfully!" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const applyForRoommate = async (
  req: AuthenticationRequest,
  res: Response
) => {
  try {
    const applicantId = req.user?.id;
    const { roommateOpeningId, message } = req.body;

    if (!applicantId)
      return res.status(401).json({ message: "Please log in to apply." });

    const [vacancy] = await db
      .select()
      .from(roommate)
      .where(eq(roommate.id, roommateOpeningId));
    if (!vacancy)
      return res.status(404).json({ message: "Roommate vacancy not found." });

    if (vacancy.ownerId === applicantId) {
      return res
        .status(400)
        .json({ message: "You cannot apply for your own vacancy." });
    }

    const [existing] = await db
      .select()
      .from(roommateApplications)
      .where(
        and(
          eq(roommateApplications.roommateOpeningId, roommateOpeningId),
          eq(roommateApplications.applicantId, applicantId)
        )
      );
    if (existing)
      return res
        .status(400)
        .json({ message: "Application already submitted." });

    await db.insert(roommateApplications).values({
      roommateOpeningId,
      applicantId,
      message: message || "I'd like to be your roommate!",
    });

    res.status(201).json({ message: "Roommate request sent!" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
