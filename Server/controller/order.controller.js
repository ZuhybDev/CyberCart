import { Order } from "../models/order.model.js";
import { product } from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length == 0) {
      return res.status(400).json({ message: "No Order items" });
    }

    for (const items of orderItems) {
      const productFromDb = await product.findById(items.product._id);
      if (!productFromDb) {
        return res
          .status(404)
          .json({ message: `Product ${items.name} not found` });
      }

      if (productFromDb.stock < items.quantity) {
        res
          .status(400)
          .json({ message: `Insufficient stock for ${productFromDb.name}` });
      }
    }

    const order = Order.create({
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    for (const items of orderItems) {
      await product.findByIdAndUpdate(items.product._id, {
        $inc: { stock: -items.quantity },
      });
    }
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error({ message: "Error creating order controller", error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ clerkId: req.user.clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // chech if the order has been reviewed

    const orderWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        const review = await review.findOne({ orderId: order._id });
        return {
          ...order.toObject(),
          hasReviewed: !!review,
        };
      })
    );

    res.status(200).json({ order: orderWithReviewStatus });
  } catch (error) {
    console.error({
      message: "Error fetching order from order controller",
      error,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
