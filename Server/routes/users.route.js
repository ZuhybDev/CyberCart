import {
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAdress,
  addWishList,
  removeWishList,
  getAllwishList,
} from "../controller/user.controller.js";
import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protectRoute);

//addresses
router.post("/addresses", addAddress);
router.get("/addresses", getAllAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAdress);

//wishlist
router.post("/wishlist", addWishList);
router.delete("/wishlist/:productId", removeWishList);
router.get("/wishlist", getAllwishList);

export default router;
