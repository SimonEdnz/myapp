import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
    created_by: 1, // Example user ID
  });

  useEffect(() => {
    axios.get('http://localhost:5000/expenses') // Update with actual endpoint
      .then(response => setExpenses(response.data))
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleCreateExpense = () => {
    axios.post('http://localhost:5000/expenses', newExpense)
      .then(() => {
        alert('Expense created successfully!');
        setExpenses([...expenses, newExpense]);
      })
      .catch(error => console.error('Error creating expense:', error));
  };

  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {expenses.map(expense => (
          <li key={expense.expense_id}>{expense.description} - {expense.amount}</li>
        ))}
      </ul>
      <h2>Create New Expense</h2>
      <input
        type="text"
        name="description"
        value={newExpense.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="amount"
        value={newExpense.amount}
        onChange={handleInputChange}
        placeholder="Amount"
      />
      <input
        type="date"
        name="date"
        value={newExpense.date}
        onChange={handleInputChange}
        placeholder="Date"
      />
      <button onClick={handleCreateExpense}>Create Expense</button>
    </div>
  );
}

export default Expenses;