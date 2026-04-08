import Loan from "../models/loanModel.js";

export const addLoan = async (req, res) => {
  try {
    const loan = await Loan.create(req.body);
    res.json(loan);
  } catch {
    res.status(500).json("Error adding loan");
  }
};

export const getLoansByUser = async (req, res) => {
  const loans = await Loan.find({ userName: req.params.userName });
  res.json(loans);
};

export const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loan) return res.status(404).json("Loan not found");
    res.json(loan);
  } catch {
    res.status(500).json("Error updating loan");
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json("Loan not found");
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json("Error deleting loan");
  }
};