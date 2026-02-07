import { User } from "../models/user.model.js";

//add addresses
export const addAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = req.user;
    // if this is set to default unset all other addresses from default
    if (isDefault) {
      user.address.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.address.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "addresses were addedd", address: user.address });
  } catch (error) {
    console.error("Error in addresses controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ addresses: user.address });
  } catch (error) {
    console.error("Error in getAlladdresses controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const { addressId } = req.params;
    const user = req.user;

    const address = user.address.id(addressId);

    // if this is set to default unset all other addresses from default
    if (isDefault) {
      user.address.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault =
      isDefault !== "undefined" ? isDefault : address.isDefault;

    await user.save();
    res.status(200).json("Address updated successfully");
  } catch (error) {
    console.error("Error in updatedAddresses controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.address.pull(addressId);

    await user.save();
    res.status(200).json({ message: "Address successfully deleted" });
  } catch (error) {
    console.error("Error in deleting address controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//wishLissts
export const addWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // if its already in the wishlist

    if (user.wishList.includes(productId)) {
      return res
        .status(400)
        .json({ message: "Product already in the wishlist" });
    }

    user.wishList.push(productId);
    await user.save();

    res.status(201).json({ message: "product added to wishlist" });
  } catch (error) {
    console.error("Error in add wishlist controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const removeWishList = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!productId) {
      return res.status(404).json({ message: "Product Id not found" });
    }

    user.wishList.pull(productId);

    await user.save();
    res.status(201).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error({ message: "Error in remove wishlist controller", error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllwishList = async (req, res) => {
  try {
    // wishlist is an array of product arrays
    const user = await User.findById(req.user._id).populate("wishList");
    res.status(200).json({ wishList: user.wishList });
  } catch (error) {
    console.error({ message: "Error in get all wishlist controller", error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
