import { Router } from "express";
import { analyzeUserDrift } from "../controllers/driftController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post("/analyze", protect, analyzeUserDrift);

export default router;
