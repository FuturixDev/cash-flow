import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import DailyDataVisualization from './components/DailyDataVisualization'
import TransactionsListPage from './pages/TransactionsListPage'
import TransactionFormPage from './pages/TransactionFormPage'
import { supabase } from './lib/supabaseClient'

function Dashboard({ transactions, income, expense, balance, onAddTransaction }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-8 animate-fade-in">
          Cash Flow Management System
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Income Analysis */}
          <div className="card animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Income Analysis</h2>
            <div className="text-center">
              <p className="text-slate-400">Total Income</p>
              <p className="text-2xl font-bold text-cyan-400 animate-pulse">${income}</p>
            </div>
          </div>

          {/* Expense Analysis */}
          <div className="card animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Expense Analysis</h2>
            <div className="text-center">
              <p className="text-slate-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400 animate-pulse">${expense}</p>
            </div>
          </div>

          {/* Net Income */}
          <div className="card animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Net Income</h2>
            <div className="text-center">
              <p className="text-slate-400">Current Balance</p>
              <p className="text-2xl font-bold text-emerald-400 animate-pulse">${balance}</p>
            </div>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="card mt-8 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-semibold text-white mb-4">Cash Flow Overview (Last 30 Days)</h2>
          <DailyDataVisualization transactions={transactions} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          <div className="card animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/transactions/new/income')}
                className="w-full p-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                Add Income
              </button>
              <button 
                onClick={() => navigate('/transactions/new/expense')}
                className="w-full p-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Add Expense
              </button>
              <button 
                onClick={() => navigate('/transactions')}
                className="w-full p-4 rounded-lg bg-gray-900 text-slate-300 font-semibold hover:bg-gray-800 transition-colors"
              >
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error.message)
        return
      }

      setTransactions(data || [])
      calculateTotals(data || [])
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  const calculateTotals = (transactions) => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    setIncome(income)
    setExpense(expense)
    setBalance(income - expense)
  }

  const addTransaction = async (transaction) => {
    try {
      console.log('Adding transaction:', transaction)
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()

      if (error) {
        console.error('Error adding transaction:', error.message)
        return
      }

      console.log('Transaction added successfully:', data)

      if (data && data.length > 0) {
        const newTransactions = [...transactions, data[0]]
        setTransactions(newTransactions)
        calculateTotals(newTransactions)
      }
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updatedTransaction)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating transaction:', error.message)
        return
      }

      if (data && data.length > 0) {
        const newTransactions = transactions.map(t => 
          t.id === id ? data[0] : t
        )
        setTransactions(newTransactions)
        calculateTotals(newTransactions)
      }
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  const deleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting transaction:', error.message)
        return
      }

      const newTransactions = transactions.filter(t => t.id !== id)
      setTransactions(newTransactions)
      calculateTotals(newTransactions)
    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Dashboard 
              transactions={transactions}
              income={income}
              expense={expense}
              balance={balance}
              onAddTransaction={addTransaction}
            />
          } 
        />
        <Route 
          path="/transactions/new/:type" 
          element={<TransactionFormPage onAddTransaction={addTransaction} />} 
        />
        <Route 
          path="/transactions" 
          element={
            <TransactionsListPage 
              transactions={transactions}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            /> 
          }
        />
      </Routes>
    </Router>
  )
}

export default App
