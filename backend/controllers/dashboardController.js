import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import { Types } from "mongoose";

//Dashboard Data
export const getDashboardData = async (req, res) => {
    try{
        const userId = req.user._id;

        //Fetch total income & expenses
        const totalIncome = await Income.aggregate([
            { $match: {userId: new Types.ObjectId(userId)}},
            {$group:{_id:null, total: {$sum: "$amount"}}}
        ])

        const totalExpense = await Expense.aggregate([
             { $match: {userId: new Types.ObjectId(userId)}},
            {$group:{_id:null, total: {$sum: "$amount"}}}
        ])

        //get income transactions in last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 *24*60*60*1000) }
        }).sort({date:-1})

        //Get total income for last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        //get expense transactions in last 60 days
        const last60DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 *24*60*60*1000) }
        }).sort({date:-1})

        //Get total expense for last 60 days
        const expenseLast60Days = last60DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // get expense transaction in last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 *60 *60 *1000) },
        }).sort({date: -1});

        //get total expense for last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        //Fetch last 5 transactions (income + expenses)
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({date:-1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({date:-1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a,b)=>b.date - a.date);//sort latest first

        //Final Response
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            last60DaysExpenses: {
                total: expenseLast60Days,
                transactions: last60DaysExpenseTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        res.status(500).json({message: "Server Error", error})
    }
}