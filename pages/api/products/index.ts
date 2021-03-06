import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { withSentry } from "@sentry/nextjs";
import Product from "../../../models/productModel";
import db from "../../../lib/db";
import { getUser } from "../../../lib/getUser";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (req.method === "GET") {
    /**
     * @desc Fetch all products
     * @route GET /api/products
     * @access Public
     */

    const pageSize = 6;
    let page: number;
    if (Number(req.query.page) > 1) {
      page = Number(req.query.page);
    } else {
      page = 1;
    }
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    await db.connectDB();
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res
      .status(201)
      .json({ products, pages: Math.ceil(count / pageSize), page: page });
  } else if (req.method === "POST") {
    /**
     * @desc Create a  product
     * @route POST /api/products
     * @access Private/Admin
     */
    if (!session) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }
    const userData = await getUser(req);
    /**
     * @desc check to see if logged in user is admin
     */
    if (!userData.isAdmin) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }
    const product = new Product({
      name: "Sample Name",
      price: 0,
      user: userData._id,
      image:
        "https://res.cloudinary.com/dtkjg8f0n/image/upload/v1625415632/blooms_hair_products/sample_wic9ml.jpg",
      brand: "Sample brand",
      category: "Sample Category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default handler;
