import { product } from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

// products func
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, cateogry } = req.body;

    if (!name || !description || !price || !stock || !cateogry) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    if (req.files || req.files.length == 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "maximum 3 images allowed" });
    }

    const updloadPromesis = req.files.map((file) => {
      return cloudinary.uploader.updload(file.path, {
        folder: "products",
      });
    });

    const uploadResult = await Promise.all(updloadPromesis);

    const imageUrls = uploadResult.map((res) => res.secure_url);

    const products = await product.create({
      name,
      description,
      price: parseInt(price),
      stock: parseInt(stock),
      cateogry,
      images: imageUrls,
    });

    res.status(201).json(products);
  } catch (error) {
    console.error("Error creating product", error);
    res
      .status(500)
      .json({ message: "Internal Error , Failed to create product" });
  }
};
export const getAllProducts = async (_, res) => {
  try {
    const allProducts = await product.find.sort({ createdAt: -1 });
    res.status(201).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, cateogry } = req.body;

    const hasProductExist = await product.find(id);

    if (!hasProductExist) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== "undefined") product.price = parseInt(price);
    if (stock !== "undefined") product.stock = parseInt(stock);
    if (cateogry) product.cateogry = cateogry;

    // handle images if they are new

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ message: "Maximum 3 images are allowed" });
      }

      const updloadPromesis = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });

      const uploadResult = await Promise.all(updloadPromesis);
      product.images = uploadResult.map((res) => res.secure_url);
    }

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error while updating product");
    res.status(500).json({ message: "Internal server Error" });
  }
};

//orders func

export const getAllOrders = async (_, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getAllOrders in admin controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!["pending", "shipped", "deliverd"].includes(status)) {
    return res.status(400).json({ error: "Invalid Status" });
  }
  Order.status = status;

  if (!orderId) {
    return res.status(400).json({ error: "Order not found" });
  }

  if (status == "shipped" && !Order.shippedAt) {
    Order.shippedAt = new Date();
  }
  if (status == "deliverd" && !Order.deliveredAt) {
    Order.deliveredAt = new Date();
  }

  await Order.save();

  res
    .status(200)
    .json({ message: "Order status has been successfully updated" });
};

export const getAllCustomers = async (_, res) => {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDashbaordStats = async (_, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = (await revenueResult[0]?.total) || 0;
    const totalProducts = await product.countDocuments();
    const totalCustomers = await User.countDocuments();

    res
      .status(200)
      .json(
        totalRevenue,
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers
      );
  } catch (error) {
    console.error("Error fetching customers", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
