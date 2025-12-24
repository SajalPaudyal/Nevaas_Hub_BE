import "dotenv/config";
import express from "express";
import cors from "cors";

// 1. Path includes "./src/"
// 2. Extension MUST be ".js" for NodeNext compatibility
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

app.get("/test-db", async (req, res) => {
    try {
        console.log("🔍 Testing Database Connection...");
        
        // This runs a simple raw SQL query: SELECT 1 + 1
        const result = await db.execute(sql`SELECT 1 + 1 AS result`);
        
        console.log("✅ Database Response:", result);
        res.json({ message: "Database is connected!", data: result });
    } catch (error: any) {
        console.error("❌ Database Connection Error:", error);
        res.status(500).json({ 
            message: "Database connection failed", 
            error: error.message 
        });
    }
});
// Authentication Routes
app.post("/api/auth/register", upload.single("idCard"), register);
app.post("/api/auth/login", login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NevaasHub listening on port ${PORT}!`);
});
