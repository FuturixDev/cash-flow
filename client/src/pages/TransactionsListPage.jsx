import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TransactionsListPage = ({ transactions }) => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // 'all', 'income', 'expense'
  const [sortBy, setSortBy] = useState('date') // 'date', 'amount'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'

  // 過濾交易
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  // 排序交易
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    } else {
      return sortOrder === 'desc'
        ? b.amount - a.amount
        : a.amount - b.amount
    }
  })

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // 格式化金額
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // 切換排序
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  // 獲取排序圖標
  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕'
    return sortOrder === 'desc' ? '↓' : '↑'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white mr-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">
            All Transactions
          </h1>
        </div>

        <div className="card animate-fade-in bg-slate-900/70">
          {/* 過濾和排序控制 */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <label htmlFor="filter" className="text-slate-300 mr-2">Filter:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-slate-800 text-white rounded px-2 py-1 border border-slate-700"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="sort" className="text-slate-300 mr-2">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 text-white rounded px-2 py-1 border border-slate-700"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>

          {/* 交易列表 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th 
                    className="text-left py-3 px-4 text-slate-300 cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    Date {getSortIcon('date')}
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300">Description</th>
                  <th className="text-left py-3 px-4 text-slate-300">Category</th>
                  <th 
                    className="text-right py-3 px-4 text-slate-300 cursor-pointer"
                    onClick={() => toggleSort('amount')}
                  >
                    Amount {getSortIcon('amount')}
                  </th>
                  <th className="text-center py-3 px-4 text-slate-300">Type</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map(transaction => (
                    <tr 
                      key={transaction.id} 
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-slate-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {transaction.description}
                      </td>
                      <td className="py-3 px-4 text-slate-300 capitalize">
                        {transaction.category}
                      </td>
                      <td className={`py-3 px-4 text-right ${
                        transaction.type === 'income' ? 'text-cyan-400' : 'text-red-400'
                      }`}>
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          transaction.type === 'income' 
                            ? 'bg-cyan-900/50 text-cyan-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionsListPage 