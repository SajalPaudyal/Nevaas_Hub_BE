import "dotenv/config";
import express from "express";
import cors from "cors";

import { upload } from "./src/middlewares/upload.js";
import { register } from "./src/controllers/auth.controller.js";
import { login } from "./src/controllers/login.controller.js";
import { sql } from "drizzle-orm";
import { db } from "./src/db/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("NevaasHub API is working");
});


app.post("/api/auth/register", upload.single("idCard"), register);
app.post("/api/auth/login", login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NevaasHub listening on port ${PORT}!`);
});
