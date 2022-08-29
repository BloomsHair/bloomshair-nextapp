/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "@lib/prisma-db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * @desc Get user profile
   * @route GET /api/users/profile
   * @access Private
   */
  if (req.method === "GET") {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }

    try {
      const user = await prisma.users.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          isAdmin: true,
          category: true,
          shippingAddress: true,
          emailVerified: true,
          orders: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      await prisma.$disconnect();
      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json({ success: false, message: "User not found" });
      throw new Error("User not found");
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default handler;
