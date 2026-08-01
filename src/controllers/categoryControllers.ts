import { Request, Response } from "express";
import slugify from "slugify";

import Category from "../model/Categorymodel.js";
import Product from "../model/Productmodel.js";


// ===============================
// Get All Categories
// ===============================
export const getCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};


// ===============================
// Get Single Category
// ===============================
export const getCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch category",
    });
  }
};


// ===============================
// Create Category
// ===============================
export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({
      name,
    });

    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
    });
  }
};


// ===============================
// Update Category
// ===============================
export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    const category =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          slug: slugify(name, {
            lower: true,
            strict: true,
          }),
        },
        {
          new: true,
        }
      );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
    });
  }
};


// ===============================
// Delete Category
// ===============================
export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const productsCount =
      await Product.countDocuments({
        category: category._id,
      });

    if (productsCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category because it contains products",
      });
    }

    await Category.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};