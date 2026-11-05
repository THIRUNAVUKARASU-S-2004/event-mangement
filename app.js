import express from "express";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoute from "./backend/Quiz/Routes/authRoutes.js";
import { authenticate } from "./backend/Middleware/authMiddleware.js"
import { startSessionCleanup } from "./backend/jobs/sessionCleanup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Serve frontend static files
app.use(express.static(join(__dirname, "frontend")));

// Protected route
app.get("/api/home", authenticate, (req, res) => {
    return res.json({ message: "Hello world" });
});

// Auth routes
app.use("/auth", authRoute);

startSessionCleanup();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
