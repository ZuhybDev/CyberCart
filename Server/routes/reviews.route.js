import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createReview, removeReview } from "../controller/review.controller.js";

const router = Router();
router.use(protectRoute);

router.get("/", createReview);

router.get("/:id", removeReview);

export default router;
