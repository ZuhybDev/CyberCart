import { Router } from "express";
import {
  createProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashbaordStats,
  updateOrderStatus,
  updateProduct,
} from "../controller/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
//DRY
router.use(protectRoute, adminOnly);

//products routes
router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);

//admin orders route
router.get("/orders", getAllOrders);
router.get("/orders/:orderId/status", updateOrderStatus);

//customers

router.get("/customers", getAllCustomers);
router.get("/stats", getDashbaordStats);
export default router;
