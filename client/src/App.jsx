import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

function App() {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({ income: 0, expense: 0 });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) {
      setRecords(data);
      const income = data.filter((r) => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
      const expense = data.filter((r) => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
      setStats({ income, expense });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return alert('請輸入正確金額');

    const data = { type, amount: parsedAmount, note };
    const result = editingId
      ? await supabase.from('transactions').update(data).eq('id', editingId)
      : await supabase.from('transactions').insert([data]);

    if (result.error) {
      alert('❌ 操作失敗：' + result.error.message);
    } else {
      alert(editingId ? '✅ 修改成功！' : '✅ 新增成功！');
      setAmount('');
      setNote('');
      setEditingId(null);
      fetchRecords();
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setAmount(record.amount);
    setNote(record.note);
    setType(record.type);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這筆資料嗎？')) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) fetchRecords();
  };

  const pieData = [
    { name: '收入', value: stats.income },
    { name: '支出', value: stats.expense }
  ];

  const COLORS = ['#34d399', '#f87171'];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-800">金流記帳系統</h1>
          <p className="text-gray-600 mt-2">輕鬆管理你的收支紀錄</p>
        </header>

        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 總結</h2>
          <div className="flex justify-around text-center">
            <div>
              <p className="text-sm text-gray-500">總收入</p>
              <p className="text-lg font-semibold text-green-600">${stats.income}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">總支出</p>
              <p className="text-lg font-semibold text-red-500">${stats.expense}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">結餘</p>
              <p className="text-lg font-semibold text-blue-600">${stats.income - stats.expense}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6 mb-10">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded px-4 py-2 col-span-1"
            >
              <option value="expense">支出</option>
              <option value="income">收入</option>
            </select>
            <input
              type="number"
              placeholder="金額"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded px-4 py-2 col-span-1"
              required
            />
            <input
              type="text"
              placeholder="備註（可選）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border rounded px-4 py-2 col-span-1"
            />
            <div className="flex gap-2 col-span-1 justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? '儲存修改' : '新增紀錄'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setAmount('');
                    setNote('');
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  取消
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📈 收支圖表</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 歷史紀錄</h2>
          {records.length === 0 ? (
            <p className="text-gray-500">目前尚無紀錄</p>
          ) : (
            <ul className="space-y-3">
              {records.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.type === 'income' ? '收入' : '支出'}：${item.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.note || '—'}｜{new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      刪除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
