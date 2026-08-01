import express from "express";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);


export default router;