
import React from 'react';
import { MonetizationEntry, ExpenseItem } from '../../types';

interface MonetizationSummaryProps {
  entries: MonetizationEntry[];
  expenses: ExpenseItem[];
  darkMode?: boolean;
}

export const MonetizationSummary: React.FC<MonetizationSummaryProps> = ({ entries, expenses, darkMode }) => {
  const totalEarnings = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalEarnings - totalExpenses;
  
  const numberOfEntries = entries.length;
  const numberOfExpenses = expenses.length;

  const summaryCardClasses = `${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-700'} p-4 rounded-lg shadow`;
  const labelClasses = `${darkMode ? 'text-slate-400' : 'text-gray-500'} text-sm block`;
  const valueClasses = `text-2xl font-semibold`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className={summaryCardClasses}>
        <span className={labelClasses}>Total Earnings</span>
        <p className={`${valueClasses} ${darkMode ? 'text-green-400' : 'text-green-600'}`}>${totalEarnings.toFixed(2)}</p>
        <span className="text-xs text-gray-400 dark:text-slate-500">{numberOfEntries} entries</span>
      </div>
      <div className={summaryCardClasses}>
        <span className={labelClasses}>Total Expenses</span>
        <p className={`${valueClasses} ${darkMode ? 'text-red-400' : 'text-red-500'}`}>${totalExpenses.toFixed(2)}</p>
         <span className="text-xs text-gray-400 dark:text-slate-500">{numberOfExpenses} entries</span>
      </div>
      <div className={summaryCardClasses}>
        <span className={labelClasses}>Net Profit</span>
        <p className={`${valueClasses} ${netProfit >= 0 ? (darkMode ? 'text-sky-400' : 'text-sky-600') : (darkMode ? 'text-orange-400' : 'text-orange-500')}`}>
          ${netProfit.toFixed(2)}
        </p>
      </div>
      <div className={summaryCardClasses}>
        <span className={labelClasses}>Avg. Earning / Entry</span>
        <p className={`${valueClasses} ${darkMode ? 'text-accent-400' : 'text-primary-600'}`}>
          ${numberOfEntries > 0 ? (totalEarnings / numberOfEntries).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  );
};
