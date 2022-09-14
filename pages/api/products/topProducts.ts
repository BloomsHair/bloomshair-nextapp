import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    /**
     * @desc Get top rated products
     * @route GET /api/products/topProducts
     * @access Public
     */

    const products = await prisma.product.findMany({
      orderBy: {
        rating: "desc",
      },
      take: 4,
    });
    await prisma.$disconnect();
    res.status(200).json(products);
  }
}

export default handler;
