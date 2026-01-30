import { review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { product } from "../models/product.model.js";

export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const user = req.user;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (user.clerkId !== order.clerkId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to review this order" });
    }

    if (order.status !== "delivered") {
      return res.json({ message: "Can only review delivered orders" });
    }

    //verify product is in the order
    const productOrder = await order.orderItems.find(
      (item) => item.product.toString() == productId.toString(),
    );

    if (!productOrder) {
      return res.json({ message: "Product not found in this order" });
    }

    const existReview = await review.findOne({ productId, userId: user._id });

    if (existReview) {
      res.status(403).json({ message: "You have already review this order" });
    }

    // atomic update or create
    const rev = await review.create({
      productId,
      userId: user._id,
      orderId,
      rating,
    });

    const pro = await product.findById(productId);
    const reviews = review.find({ productId });
    const totalRating = reviews.reduce((s, r) => s + r.rating, 0);
    pro.averageRating = totalRating / reviews.length;
    pro.totalReviews = reviews.length;
    await product.save();

    res.status(201).json({ message: "Review submitted successfully", rev });
  } catch (error) {
    console.log("error in the create review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    const rev = await review.findById(reviewId);

    if (!rev) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    const productId = review.productId;
    await review.findByIdAndDelete(productId);

    const reviews = review.find({ productId });
    const totalRating = reviews.reduce((s, r) => s + r.rating, 0);
    await product.findByIdAndUpdate(productId, {
      averageRating:
        (await reviews).length > 0 ? totalRating / (await reviews).length : 0,
      totalReviews: (await reviews).length,
    });

    res.status(201).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log("error deleting review", error);

    res.status(500).json({ message: "Internal server error" });
  }
};
