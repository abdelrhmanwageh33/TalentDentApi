import express from "express";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import cartRoute from "./cartRoute.js"

const router = express.Router();

router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart",cartRoute)


export default router;