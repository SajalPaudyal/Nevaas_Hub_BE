import "dotenv/config";
import express, { Response } from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes";
import propertyRoutes from "./src/routes/property.routes";
import adminRoutes from "./src/routes/admin.routes";
import applicationRoutes from "./src/routes/application.routes";
import roommateOpeningRoutes from "./src/routes/roommate_vacancies.routes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/", (req, res) => {
  res.send("NevaasHub API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/roommate-openings", roommateOpeningRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NevaasHub listening on port ${PORT}!`);
});
