import dotenv from "dotenv";
dotenv.config();

import path from "path";
import slugify from "slugify";

import connectDB from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

import Product from "../model/Productmodel.js";
import Category from "../model/Categorymodel.js";

import { productsData } from "./productsData.js";

async function seed() {
  try {
    await connectDB();
    console.log("✅ Connected");

    // حذف البيانات القديمة
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryNames = Object.keys(productsData);

    for (const categoryName of categoryNames) {
      // إنشاء الكاتيجوري
      const category = await Category.create({
        name: categoryName,
        slug: slugify(categoryName, {
          lower: true,
          strict: true,
        }),
      });

      const products =
        productsData[
          categoryName as keyof typeof productsData
        ];

      const productsToInsert = [];

      for (const product of products) {
        // المسار الحقيقي للصورة
        const imagePath = path.join(
          process.cwd(),
          "public",
          product.src
        );

        console.log(`⬆ Uploading: ${imagePath}`);

        // رفع الصورة
        const uploadResult = await cloudinary.uploader.upload(
          imagePath,
          {
            folder: "trendy-products",
          }
        );

        productsToInsert.push({
          name: product.title,

          slug: slugify(
            `${product.title}-${categoryName}`,
            {
              lower: true,
              strict: true,
            }
          ),

          image: uploadResult.secure_url,

          price: product.price,

          // خصم عشوائي
          discount: [0, 0, 0, 10, 15, 20][
            Math.floor(Math.random() * 6)
          ],

          stock: product.quantity,

          description: "",

          brand: "",

          featured: false,

          // حوالي 15% من المنتجات
          isBestSeller: Math.random() < 0.15,

          // حوالي 20% من المنتجات
          isNewArrival: Math.random() < 0.2,

          active: true,

          category: category._id,
        });
      }

      await Product.insertMany(productsToInsert);

      console.log(
        `✅ ${categoryName} Added (${products.length} products)`
      );
    }

    console.log("🎉 Database Seeded Successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();