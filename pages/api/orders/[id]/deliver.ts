/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import Order from "../../../../models/orderModel";
import db from "../../../../lib/db";
import { getUser } from "../../../../lib/getUser";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  /**
   * @desc Update order to delivered
   * @route PUT /api/orders/:id/deliver
   * @access Private/Admin
   */
  if (req.method === "PUT") {
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

    const userData = await getUser(req);
    /**
     * @desc check to see if logged in user is admin
     */
    if (!userData.isAdmin) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }

    await db.connectDB();

    const order = await Order.findById(id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
      throw new Error("Order not found");
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default withSentry(handler);
