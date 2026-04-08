import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createUser);
router.get("/", protect, getUsers);

export default router;