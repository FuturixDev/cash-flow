import { useState } from 'react'

const TransactionForm = ({ onAddTransaction, type }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: type === 'income' ? 'salary' : 'food',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const transaction = {
      ...formData,
      type,
      amount: parseFloat(formData.amount),
      created_at: new Date().toISOString()
    }
    onAddTransaction(transaction)
    setFormData({
      description: '',
      amount: '',
      category: type === 'income' ? 'salary' : 'food',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const categories = {
    income: ['salary', 'freelance', 'investment', 'other'],
    expense: ['food', 'transport', 'utilities', 'entertainment', 'other']
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories[type].map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-slate-400 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className={`w-full p-2 rounded-lg font-semibold text-white transition-all ${
          type === 'income' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        Add {type === 'income' ? 'Income' : 'Expense'}
      </button>
    </form>
  )
}

export default TransactionForm 