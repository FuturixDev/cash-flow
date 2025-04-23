// client/src/TransactionForm.jsx
import { useState } from 'react';

export default function TransactionForm({ onSubmit }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return alert('請輸入金額');

    const data = {
      type,
      amount: parseFloat(amount),
      note,
    };

    onSubmit(data);
    setAmount('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4 max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold">新增記帳紀錄</h2>

      <div>
        <label>
          <input
            type="radio"
            value="expense"
            checked={type === 'expense'}
            onChange={() => setType('expense')}
          />
          支出
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="income"
            checked={type === 'income'}
            onChange={() => setType('income')}
          />
          收入
        </label>
      </div>

      <div>
        <input
          type="number"
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="備註"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
        儲存
      </button>
    </form>
  );
}
