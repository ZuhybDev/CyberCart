import { Router } from "express";
import { createOrder, getUserOrders } from "../controller/order.controller.js";

const router = Router();

router.post("/", createOrder);
router.get("/", getUserOrders);

export default router;
