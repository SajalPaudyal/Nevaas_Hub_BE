import { Response } from "express";
import { db } from "../../db/index";
import { AuthenticationRequest } from "../../middlewares/checkAuthenticatedUsers";
import { desc, eq } from "drizzle-orm";
import { properties } from "../../db/schema";

export const getAllProperties = async (
  req: AuthenticationRequest,
  res: Response
) => {
  try {
    const data = await db.query.properties.findMany({
      orderBy: [desc(properties.id)],
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
    const propertyId = parseInt(req.params.id);

    if (isNaN(propertyId)) {
      res
        .status(500)
        .json({ message: "could not get property with the given ID." });
    }

    const data = await db.query.properties.findFirst({
      where: eq(properties.id, propertyId),
    });

    if (!data) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(data);
  } catch (e: any) {
    res
      .status(500)
      .json({ message: "could not get the property", error: e.message });
  }
};
