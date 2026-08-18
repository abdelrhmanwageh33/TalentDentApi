import { Request, Response } from "express";
import mongoose from "mongoose";

import Product from "../model/Productmodel.js";
import Order from "../model/Ordermodel.js";

// =====================================================
// Create Order
// POST /api/orders
// =====================================================
export const createOrder = async (
  req: Request,
  res: Response
) => {
  const session = await mongoose.startSession();

  try {
    const { customer, items } = req.body;

    // =========================
    // Validate customer
    // =========================

    if (
      !customer?.name?.trim() ||
      !customer?.phone?.trim() ||
      !customer?.address?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, phone and address are required",
      });
    }

    // =========================
    // Validate items
    // =========================

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    session.startTransaction();

    const orderItems: {
      product: mongoose.Types.ObjectId;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }[] = [];

    let totalPrice = 0;

    // =========================
    // Process products
    // =========================

    for (const item of items) {
      // Validate product ID
      if (
        !item.product ||
        typeof item.product !== "string" ||
        !mongoose.Types.ObjectId.isValid(item.product)
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      // Validate quantity
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message:
            "Product quantity must be a positive integer",
        });
      }

      // Find product
      const product = await Product.findById(
        item.product
      ).session(session);

      if (!product) {
        await session.abortTransaction();

        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Check active
      if (!product.active) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `${product.name} is currently unavailable`,
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) left`,
        });
      }

      // =========================
      // Price from database
      // =========================

      const price = product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price,
        quantity: item.quantity,
      });

      // Calculate total
      totalPrice += price * item.quantity;

      // Decrease stock
      product.stock -= item.quantity;

      await product.save({ session });
    }

    // =========================
    // Generate Order Number
    // =========================

    const orderNumber = `ORD-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // =========================
    // Create Order
    // =========================

    const [order] = await Order.create(
      [
        {
          orderNumber,

          customer: {
            name: customer.name.trim(),
            phone: customer.phone.trim(),
            address: customer.address.trim(),
            notes: customer.notes?.trim() || "",
          },

          items: orderItems,

          totalPrice,

          status: "pending",
        },
      ],
      { session }
    );

    // =========================
    // Commit transaction
    // =========================

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  } finally {
    await session.endSession();
  }
};

// =====================================================
// Get All Orders
// GET /api/orders
//
// ?page=1
// ?limit=10
// ?status=pending
// =====================================================

export const getOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    // =========================
    // Build filter
    // =========================

    const filter: Record<string, unknown> = {};

    if (status) {
      const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      filter.status = status;
    }

    // =========================
    // Get orders + count
    // =========================

    const [orders, totalOrders] =
      await Promise.all([
        Order.find(filter)
          .populate(
            "items.product",
            "name slug image price stock active"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        Order.countDocuments(filter),
      ]);

    const totalPages = Math.ceil(
      totalOrders / limit
    );

    res.status(200).json({
      success: true,

      count: orders.length,

      pagination: {
        currentPage: page,
        limit,
        totalOrders,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },

      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// =====================================================
// Get Single Order
// GET /api/orders/:id
// =====================================================

export const getOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Fix TypeScript string | string[]
    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id).populate(
      "items.product",
      "name slug image price stock active"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// =====================================================
// Update Order Status
// PATCH /api/orders/:id/status
// =====================================================

export const updateOrderStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fix TypeScript string | string[]
    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
    });
  }
};

// =====================================================
// Delete Order
// DELETE /api/orders/:id
// =====================================================

export const deleteOrder = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Fix TypeScript string | string[]
    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order =
      await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
};