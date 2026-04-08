import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();
connectDB();

const app = express();

console.log(process.env.CORS_ORIGIN);

app.use(cors({
    origin: "http://192.168.1.7:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Hisab API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));