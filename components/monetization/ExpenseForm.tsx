
import React, { useState, useEffect } from 'react';
import { ExpenseItem } from '../../types';

interface ExpenseFormProps {
  onSave: (expense: ExpenseItem) => void;
  onCancel: () => void;
  initialExpense?: ExpenseItem | null;
  darkMode?: boolean;
}

const expenseCategories = ['Software', 'Equipment', 'Advertising', 'Services', 'Travel', 'Office Supplies', 'Education', 'Other'];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, onCancel, initialExpense, darkMode }) => {
  const [description, setDescription] = useState<string>(initialExpense?.description || '');
  const [amount, setAmount] = useState<number>(initialExpense?.amount || 0);
  const [date, setDate] = useState<string>(
    initialExpense?.date ? new Date(initialExpense.date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10)
  );
  const [category, setCategory] = useState<string>(initialExpense?.category || expenseCategories[0]);

  useEffect(() => {
    if (initialExpense) {
      setDescription(initialExpense.description);
      setAmount(initialExpense.amount);
      setDate(new Date(initialExpense.date).toISOString().substring(0, 10));
      setCategory(initialExpense.category);
    } else {
      setDescription('');
      setAmount(0);
      setDate(new Date().toISOString().substring(0, 10));
      setCategory(expenseCategories[0]);
    }
  }, [initialExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0 || !date || !category) {
        alert("Please fill in Description, Amount (greater than 0), Date, and Category.");
        return;
    }
    onSave({
      id: initialExpense?.id || Date.now().toString(),
      description,
      amount,
      date: new Date(date).toISOString(),
      category,
    });
  };

  const inputClasses = `${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-accent-500 focus:border-accent-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'} block w-full sm:text-sm border rounded-md p-2 shadow-sm`;
  const labelClasses = `block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'} mb-1`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="expenseDescription" className={labelClasses}>Description</label>
        <input type="text" id="expenseDescription" value={description} onChange={e => setDescription(e.target.value)} className={inputClasses} required placeholder="e.g., Video editing software subscription" />
      </div>
      <div>
        <label htmlFor="expenseAmount" className={labelClasses}>Amount ($)</label>
        <input type="number" id="expenseAmount" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} min="0.01" step="0.01" className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="expenseDate" className={labelClasses}>Date</label>
        <input type="date" id="expenseDate" value={date} onChange={e => setDate(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="expenseCategory" className={labelClasses}>Category</label>
        <select id="expenseCategory" value={category} onChange={e => setCategory(e.target.value)} className={inputClasses} required>
          {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} py-2 px-4 rounded-md font-medium transition`}>
          Cancel
        </button>
        <button type="submit" className={`${darkMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-500 hover:bg-orange-600'} text-white py-2 px-4 rounded-md font-medium transition shadow-sm`}>
          {initialExpense ? 'Save Changes' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};
