import { Router } from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartControllers.js";

const router = Router();

// Get Cart
router.get("/:guestId", getCart);

// Add Product To Cart
router.post("/", addToCart);

// Update Product Quantity
router.put("/:guestId/:productId", updateCartItem);

// Remove Product From Cart
router.delete("/:guestId/:productId", removeFromCart);

// Clear Cart
router.delete("/:guestId", clearCart);

export default router;