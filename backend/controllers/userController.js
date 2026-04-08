import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      if (field === "name") return res.status(400).json("Customer with this name already exists");
      if (field === "phone") return res.status(400).json("Customer with this phone number already exists");
      return res.status(400).json("Customer already exists");
    }
    res.status(500).json("Error creating user");
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      if (field === "name") return res.status(400).json("Customer with this name already exists");
      if (field === "phone") return res.status(400).json("Customer with this phone number already exists");
      return res.status(400).json("Customer already exists");
    }
    res.status(500).json("Error updating user");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json("User not found");
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json("Error deleting user");
  }
};