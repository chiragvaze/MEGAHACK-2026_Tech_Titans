import express from "express";
import cors from "cors";
import matchingRoutes from "./routes/matchingRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import trialRoutes from "./routes/trialRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Clinical Trial Matcher API",
    endpoints: [
      "/api/patient/create",
      "/api/patient/upload",
      "/api/patient/:id",
      "/api/trial/create",
      "/api/trial/all",
      "/api/trial/:id",
      "/api/trial/import",
      "/api/ai/parse-criteria",
      "/api/ai/explain-match",
      "/api/match/rule-check",
      "/api/match/semantic",
      "/api/match/recommendations",
      "/api/match/explanation",
      "/api/chat/explain"
    ]
  });
});

app.use("/api/matching", matchingRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/trial", trialRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
