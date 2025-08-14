import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PORT } from "./config";
import authRoutes from "./routes/auth";
import githubRoutes from "./routes/github";
import aiRoutes from "./routes/ai";
import prRoutes from "./routes/pr";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";
import session from "express-session";
dotenv.config();


const app = express();

app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true,
}));
app.use(express.json({ limit: '100mb' })); // allow up to 5 MB
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan("dev"));


app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,       // Must be false if not using HTTPS (localhost dev)
    httpOnly: true,
    sameSite: "lax",     // or "strict"
    maxAge: 24 * 60 * 60 * 1000, // 1 day or whatever you want
  }
}));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pr", prRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ API server running on port ${PORT}`);
});

 