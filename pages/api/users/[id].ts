/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import User from "../../../models/userModel";
import db from "../../../lib/db";
import { getUser } from "../../../lib/getUser";

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

  const userData = await getUser(req);
  /**
   * @desc check to see if logged in user is admin
   */
  if (!userData.isAdmin) {
    res.status(401).json({ message: "Not Authorized" });
    return;
  }

  await db.connectDB();

  if (req.method === "GET") {
    /**
     * @desc Get user by Id
     * @route GET /api/users/:id
     * @access Private/admin
     */
    const user = await User.findById(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else if (req.method === "PUT") {
    /**
     * @desc UPDATE user
     * @route PUT /api/users/:id
     * @access Private/Admin
     */
    const { displayName, image, email, isAdmin, category } = req.body;

    const user = await User.findById(id);

    if (user) {
      user.name = displayName || user.name;
      user.image = image || user.image;
      user.email = email || user.email;
      user.isAdmin = isAdmin || user.isAdmin;
      user.category = category || user.category;

      const updatedUser = await user.save();

      res.status(204).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        category: updatedUser.category,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else if (req.method === "DELETE") {
    /**
     * @desc Delete all users
     * @route DELETE /api/users/:id
     * @access Private/admin
     */
    try {
      const user = await User.findById(id);

      if (user) {
        await user.remove();
        res.json({ message: "User removed successfully" });
      }
    } catch (error) {
      res.status(404).json({ message: "Error removing user" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

export default handler;
