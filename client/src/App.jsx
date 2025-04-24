import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import DailyDataVisualization from './components/DailyDataVisualization'
import TransactionPage from './pages/TransactionPage'
import TransactionsListPage from './pages/TransactionsListPage'

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="card animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/transaction/income')}
                className="w-full p-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
              >
                Add Income
              </button>
              <button 
                onClick={() => navigate('/transaction/expense')}
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

          {/* Budget Tracking */}
          <div className="card animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-xl font-semibold text-white mb-4">Budget Tracking</h2>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400">Monthly Budget</p>
                <p className="text-2xl font-bold text-white">$5,000</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400">Remaining</p>
                <p className="text-2xl font-bold text-emerald-400">$1,800</p>
              </div>
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
    const storedTransactions = localStorage.getItem('transactions')
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions)
      setTransactions(parsedTransactions)
      calculateTotals(parsedTransactions)
    }
  }, [])

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

  const addTransaction = (transaction) => {
    const newTransactions = [...transactions, transaction]
    setTransactions(newTransactions)
    localStorage.setItem('transactions', JSON.stringify(newTransactions))
    calculateTotals(newTransactions)
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
          path="/transaction/:type" 
          element={<TransactionPage onAddTransaction={addTransaction} />} 
        />
        <Route 
          path="/transactions" 
          element={<TransactionsListPage transactions={transactions} />} 
        />
      </Routes>
    </Router>
  )
}

export default App
