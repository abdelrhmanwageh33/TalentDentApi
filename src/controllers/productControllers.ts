import { Request, Response } from "express";
import Product from "../model/Productmodel.js";
import Category from "../model/Categorymodel.js";
import slugify from "slugify";


// ======================
// Get All Products
// ======================
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ======================
// Get Single Product
// ======================
export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ======================
// Get Products By Category
// ======================
export const getProductsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const products = await Product.find({
      category: category._id,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category products",
    });
  }
};

// ======================
// Search Products
// ======================
export const searchProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const keyword = req.query.keyword as string;

    const products = await Product.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};


// =========================
// Create Product
// =========================
export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await Product.create({
      ...req.body,
      slug: slugify(req.body.name, {
        lower: true,
        strict: true,
      }),
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error,
    });
  }
};

// =========================
// Update Product
// =========================
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const updatedData = {
      ...req.body,
    };

    if (req.body.name) {
      updatedData.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error,
    });
  }
};

// =========================
// Delete Product
// =========================
export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error,
    });
  }
};