import { Request, Response } from "express";
import Cart from "../model/cartmodel.js";
import Product from "../model/Productmodel.js";

// ======================
// Get Cart
// ======================
export const getCart = async (
  req: Request,
  res: Response
) => {
  try {
    const { guestId } = req.params;

    const cart = await Cart.findOne({
      guestId,
    }).populate(
      "items.product",
      "name slug image price stock"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          guestId,
          items: [],
          totalPrice: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

// ======================
// Add Product To Cart
// ======================
export const addToCart = async (
  req: Request,
  res: Response
) => {
  try {
    const { guestId } = req.body;
    const { productId, quantity = 1 } = req.body;

    if (!guestId || !productId) {
      return res.status(400).json({
        success: false,
        message: "guestId and productId are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Get real product from database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      guestId,
    });

    // Create cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        guestId,
        items: [
          {
            product: product._id,
            quantity,
            price: product.price,
          },
        ],
        totalPrice: product.price * quantity,
      });

      await cart.save();

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    // Check if product already exists
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() ===
        product._id.toString()
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock",
        });
      }

      existingItem.quantity = newQuantity;

      // Update price from database
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => {
        return (
          total +
          item.price * item.quantity
        );
      },
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

// ======================
// Update Cart Item Quantity
// ======================
export const updateCartItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { guestId, productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      guestId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Get real product
    const product = await Product.findById(
      productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }

    item.quantity = quantity;

    // Keep latest real price
    item.price = product.price;

    // Recalculate total
    cart.totalPrice = cart.items.reduce(
      (total, item) => {
        return (
          total +
          item.price * item.quantity
        );
      },
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// ======================
// Remove Product From Cart
// ======================
export const removeFromCart = async (
  req: Request,
  res: Response
) => {
  try {
    const { guestId, productId } = req.params;

    const cart = await Cart.findOne({ guestId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Recalculate total
    cart.totalPrice = cart.items.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

// ======================
// Clear Cart
// ======================
export const clearCart = async (
  req: Request,
  res: Response
) => {
  try {
    const { guestId } = req.params;

    const cart = await Cart.findOne({ guestId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Clear items
    cart.items.splice(0, cart.items.length);

    // Reset total
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};