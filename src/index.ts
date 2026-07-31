import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api", routes);

// Database
await connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});