import { Router } from "express";
import { chatExplain } from "../controllers/chatController.js";

const router = Router();

router.post("/explain", chatExplain);

export default router;
