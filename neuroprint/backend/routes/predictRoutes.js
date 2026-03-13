import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { predictRisk } from "../controllers/predictController.js";

const router = Router();

router.get("/risk", protect, predictRisk);

export default router;
