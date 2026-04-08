import express from "express";
import { addLoan, getLoansByUser, updateLoan, deleteLoan } from "../controllers/loanController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, addLoan);
router.get("/:userName", protect, getLoansByUser);
router.put("/:id", protect, updateLoan);
router.delete("/:id", protect, deleteLoan);

export default router;