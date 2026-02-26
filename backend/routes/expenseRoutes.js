import express from "express"
import { protect } from "../middleware/authMiddleware.js";
import {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel
} from '../controllers/expenseController.js'

const router = express.Router();

router.post("/add", protect, addExpense)
router.get("/get", protect, getAllExpense);
router.get("/downloadexcel", protect, downloadExpenseExcel)
router.delete("/:id", protect, deleteExpense);

export default router