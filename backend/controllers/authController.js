import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json("Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json("Invalid credentials");

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  res.json({ token });
};