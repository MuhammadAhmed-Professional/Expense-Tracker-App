
import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../Charts/CustomLineChart';




const ExpenseOverview = ({transactions, onAddExpense}) => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        
        const result = prepareExpenseLineChartData(transactions);
        setChartData(result)
    }, [transactions])

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <div>
                <h5 className='text-lg'>Expense Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>Track your Spending Trends over time and Gain Insights info about where your money goes</p>
            </div>

            <button className='add-btn' onClick={onAddExpense}>
                <LuPlus className='text-lg'/> Add Expanse
            </button>
        </div>

        <div className='mt-10'>
            <CustomLineChart data={chartData}/>
        </div>
    </div>
  )
}

export default ExpenseOverview
