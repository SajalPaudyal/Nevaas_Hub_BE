import { Response } from "express";
import { db } from "../../db/index";
import { AuthenticationRequest } from "../../middlewares/checkAuthenticatedUsers";
import { eq } from "drizzle-orm";
import { properties } from "../../db/schema";

export const getAllProperties = async (
  req: AuthenticationRequest,
  res: Response
) => {
  try {
    const data = await db.query.properties.findMany({
      with: { roommateDetails: true },
    });
    res.json(data);
  } catch (e: any) {
    res
      .status(500)
      .json({ message: "could not get all the properties", error: e.message });
  }
};

export const getSingleProperty = async (req: any, res: Response) => {
  try {
    const data = await db.query.properties.findFirst({
      where: eq(properties.id, parseInt(req.params.id)),
      with: { roommateDetails: true },
    });
    res.json(data);
  } catch (e: any) {
    res
      .status(500)
      .json({ message: "could not get the property", error: e.message });
  }
};
