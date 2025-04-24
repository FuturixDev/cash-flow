import { useNavigate, useParams } from 'react-router-dom'
import TransactionForm from '../components/TransactionForm'

const TransactionPage = ({ onAddTransaction }) => {
  const navigate = useNavigate()
  const { type } = useParams()

  const handleSubmit = (transaction) => {
    onAddTransaction(transaction)
    navigate('/')
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
            <TransactionForm
              type={type}
              onAddTransaction={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionPage 