import { product } from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

export const createProducts = async (req, res) => {
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
    if (price) product.price = parseInt(price);
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
