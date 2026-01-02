import { Request, Response } from "express";
import { db } from "../../db/index";
import {
  users,
  propertyApplications,
  roommateApplications,
  properties,
  roommate,
} from "../../db/schema";
import { eq, aliasedTable } from "drizzle-orm";

export const getPendingVerifications = async (req: Request, res: Response) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  await db
    .update(users)
    .set({ status })
    .where(eq(users.id, Number(id)));
  res.json({ message: `User status is now ${status}` });
};

export const getPropertyApplications = async (req: Request, res: Response) => {
  const owners = aliasedTable(users, "owners");

  const results = await db
    .select({
      applicationId: propertyApplications.id,
      propertyId: properties.id,
      applicantName: users.fullName,
      applicantEmail: users.email,
      applicantStatus: users.status,
      applicantPhone: users.phone,

      propertyTitle: properties.title,
      propertyPrice: properties.price,

      ownerName: owners.fullName,
      ownerEmail: owners.email,
      ownerPhone: owners.phone,
    })
    .from(propertyApplications)
    .innerJoin(users, eq(propertyApplications.applicantId, users.id))
    .innerJoin(properties, eq(propertyApplications.propertyId, properties.id))
    .innerJoin(owners, eq(properties.ownerId, owners.id));

  res.json(results);
};

export const getRoommateApplications = async (req: Request, res: Response) => {
  const owners = aliasedTable(users, "owners");

  const results = await db
    .select({
      applicationId: roommateApplications.id,
      openingId: roommate.id,
      seekerName: users.fullName,
      seekerEmail: users.email,
      seekerPhone: users.phone,
      seekerFaculty: roommateApplications.id,
      vacancyTitle: roommate.title,
      ownerName: owners.fullName,
      ownerPhone: owners.phone,
    })
    .from(roommateApplications)
    .innerJoin(users, eq(roommateApplications.applicantId, users.id))
    .innerJoin(
      roommate,
      eq(roommateApplications.roommateOpeningId, roommate.id)
    )
    .innerJoin(owners, eq(roommate.ownerId, owners.id));

  res.json(results);
};
