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