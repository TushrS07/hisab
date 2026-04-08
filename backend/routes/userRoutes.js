import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/userController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createUser);
router.get("/", protect, getUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
