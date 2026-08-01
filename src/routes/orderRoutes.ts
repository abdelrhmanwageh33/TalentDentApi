import express from "express";

import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/ordersControllers.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:id", getOrder);

router.patch("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;