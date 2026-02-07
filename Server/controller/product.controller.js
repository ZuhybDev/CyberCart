import { product } from "../models/product.model.js";

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await product.findById(id);

    if (!products) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: "Internal server error", err: error });
    console.log("Error fetching products");
  }
};
