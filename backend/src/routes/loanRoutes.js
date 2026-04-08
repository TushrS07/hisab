import express from "express";
import { addLoan, getLoansByUser } from "../controllers/loanController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addLoan);
router.get("/:userName", protect, getLoansByUser);

export default router;