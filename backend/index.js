import express from "express";
import 'dotenv/config'
import cors from "cors";
import resumeRouter from "./routes/resume.js";
import authRouter from "./routes/auth.js";
import passport from 'passport';
import session from 'express-session';
import pgSession from "connect-pg-simple";
import pool from "./db.js";

const app = express()

app.use(cors({
  origin: "https://resume-analyzer-mu-seven.vercel.app", // React frontend
  credentials: true,              // ✅ allow cookies
}));
app.use(express.json());
app.use(express.static("public"));

app.set("trust proxy", 1);
const PgStore = pgSession(session);
app.use(session({
  store: new PgStore({
    pool: pool,
    tableName: "session",
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: true,        // MUST be true on HTTPS (Render)
    sameSite: "none",    // REQUIRED for cross-origin (Vercel frontend)
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})