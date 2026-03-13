import { Router } from "express";
import { createBaselineProfile } from "../controllers/baselineController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", protect, createBaselineProfile);

export default router;
