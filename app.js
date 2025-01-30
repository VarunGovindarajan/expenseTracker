import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import Balance from './components/Balance';
import IncomeExpense from './components/IncomeExpense';
import axios from 'axios';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get('https://expensetracker-nx9c.onrender.com/api/expenses')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Error fetching transactions:', err));
  }, []);

  const onAddTransaction = (data) => {
    axios
      .post('https://expensetracker-nx9c.onrender.com/api/expenses', data) 
      .then((res) => {
        setTransactions([...transactions, res.data]); 
      })
      .catch((err) => console.error('Error adding transaction:', err));
  };

  const onDeleteTransaction = (id) => {
    console.log('Deleting transaction with ID:', id);
    axios
      .delete(`https://expensetracker-nx9c.onrender.com/api/expenses/${id}`) 
      .then(() => {
        console.log('Transaction deleted successfully');
        setTransactions(transactions.filter((transaction) => transaction.id !== id)); 
      })
      .catch((err) => console.error('Error deleting transaction:', err));
  };

  return (
    <>
      <h1>Expense Tracker</h1>
      <div className="container">
        <Balance transactions={transactions} />
        <IncomeExpense transactions={transactions} />
        <AddTransaction onAdd={onAddTransaction} />
        <TransactionList transactions={transactions} onDelete={onDeleteTransaction} />
      </div>
    </>
  );
}

export default App;
