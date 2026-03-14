import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import callRouter from "./routes/call";
import geocodeRouter from "./routes/geocode";
import twimlRouter from "./routes/twiml";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Twilio fetches this when a call connects — must be registered before other routes
app.use("/api/twiml", twimlRouter);

// Frontend integration points — uncomment route bodies in each file when frontend is ready
app.use("/api/call", callRouter);
app.use("/api/geocode", geocodeRouter);

app.listen(PORT, () => {
  console.log(`EmergiBridge backend running on port ${PORT}`);
});
