import { Request, Response } from "express";
import Product from "../model/Productmodel.js";
import Category from "../model/Categorymodel.js";
import slugify from "slugify";

interface ProductQuery {
  page?: string;
  limit?: string;
  keyword?: string;
  category?: string;
  featured?: string;
  isBestSeller?: string;
  isNewArrival?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

// ======================
// Get All Products
// ======================
export const getProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const query = req.query as ProductQuery;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;

    const skip = (page - 1) * limit;

    const filter: any = {};

    // ======================
    // Search
    // ======================
    if (query.keyword) {
      filter.name = {
        $regex: query.keyword,
        $options: "i",
      };
    }

    // ======================
    // Category
    // ======================
    if (query.category) {
      const category = await Category.findOne({
        slug: query.category,
      });

      if (category) {
        filter.category = category._id;
      }
    }

    // ======================
    // Featured
    // ======================
    if (query.featured === "true") {
      filter.featured = true;
    }

    // ======================
    // Best Seller
    // ======================
    if (query.isBestSeller === "true") {
      filter.isBestSeller = true;
    }

    // ======================
    // New Arrival
    // ======================
    if (query.isNewArrival === "true") {
      filter.isNewArrival = true;
    }

    // ======================
    // Price Range
    // ======================
    if (query.minPrice || query.maxPrice) {
      filter.price = {};

      if (query.minPrice) {
        filter.price.$gte = Number(query.minPrice);
      }

      if (query.maxPrice) {
        filter.price.$lte = Number(query.maxPrice);
      }
    }

    // ======================
    // Sorting
    // ======================
    let sortOption: any = {
      createdAt: -1,
    };

    switch (query.sort) {
      case "price":
        sortOption = {
          price: 1,
        };
        break;

      case "-price":
        sortOption = {
          price: -1,
        };
        break;

      case "name":
        sortOption = {
          name: 1,
        };
        break;

      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;
    }

    const totalProducts =
      await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,

      page,

      limit,

      totalProducts,

      totalPages: Math.ceil(
        totalProducts / limit
      ),

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
export const getProduct = async (
  req: Request,
  res: Response
) => {
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
export const getProductsByCategory =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const category =
        await Category.findOne({
          slug: req.params.slug,
        });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const products =
        await Product.find({
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
        message:
          "Failed to fetch category products",
      });
    }
  };

// ======================
// Create Product
// ======================
export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const product =
      await Product.create({
        ...req.body,
        slug: slugify(req.body.name, {
          lower: true,
          strict: true,
        }),
      });

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create product",
      error,
    });
  }
};

// ======================
// Update Product
// ======================
export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const updatedData: any = {
      ...req.body,
    };

    if (req.body.name) {
      updatedData.slug = slugify(
        req.body.name,
        {
          lower: true,
          strict: true,
        }
      );
    }

    const product =
      await Product.findByIdAndUpdate(
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
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update product",
      error,
    });
  }
};

// ======================
// Delete Product
// ======================
export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete product",
      error,
    });
  }
};