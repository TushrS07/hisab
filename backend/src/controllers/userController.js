import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    console.error("User creation error:", err);
    if (err.code === 11000) {
      return res.status(400).json("User already exists");
    }
    res.status(500).json("Error creating user");
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};