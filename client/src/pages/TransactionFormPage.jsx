import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TransactionFormPage = ({ onAddTransaction }) => {
  const navigate = useNavigate()
  const { type } = useParams()

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
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
    navigate('/')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container p-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-white mr-4"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </h1>
          </div>

          <div className="card animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                  required
                >
                  {categories[type].map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`flex-1 p-2 rounded-lg text-white font-semibold transition-colors ${
                    type === 'income' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 p-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionFormPage 