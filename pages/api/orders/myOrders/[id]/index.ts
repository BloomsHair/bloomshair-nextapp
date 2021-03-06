/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { withSentry } from "@sentry/nextjs";
import Order from "../../../../../models/orderModel";
import db from "../../../../../lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  /**
   * @desc Get user session
   */
  const session = await getSession({ req });
  /**
   * @desc check to see if their is a user session
   */
  if (!session) {
    res.status(401).json({ message: "Not Authorized" });
    return;
  }

  if (req.method === "GET") {
    /**
     * @desc Get an order by id
     * @route Get /api/order/myOrders/:id
     * @access Private
     */
    await db.connectDB();

    const order = await Order.findOne({ _id: id }).populate(
      "user",
      "name email"
    );
    await db.disconnect();
    if (order) {
      res.status(200).json(order);
    } else {
      await db.disconnect();
      res.status(404).json({ message: "Order not found" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default withSentry(handler);
