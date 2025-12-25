import "dotenv/config";
import express, { Response } from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes";
import propertyRoutes from "./src/routes/property.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("NevaasHub API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NevaasHub listening on port ${PORT}!`);
});
