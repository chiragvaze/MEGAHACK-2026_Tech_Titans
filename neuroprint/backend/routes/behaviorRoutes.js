import { Router } from "express";
import {
	clearBehaviorHistory,
	collectBehaviorData,
	getBehaviorHistory
} from "../controllers/behaviorController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

router.post("/collect", protect, collectBehaviorData);
router.get("/history", protect, getBehaviorHistory);
router.delete("/history", protect, clearBehaviorHistory);

export default router;
