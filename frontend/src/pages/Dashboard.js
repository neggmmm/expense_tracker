import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: '', date: dayjs().format('YYYY-MM-DD'), description: '' });
  const [filter, setFilter] = useState({ category: '', start: '', end: '' });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categories] = useState(['Food', 'Groceries', 'Transport', 'Utilities', 'Other']);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch expenses and monthly stats
  const fetchExpenses = async () => {
    try {
      let url = '/expenses?';
      if (filter.category) url += `category=${filter.category}&`;
      if (filter.start) url += `start=${filter.start}&`;
      if (filter.end) url += `end=${filter.end}&`;
      const res = await api.get(url);
      setExpenses(res.data);
    } catch (err) {
      setError('Failed to fetch expenses');
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const res = await api.get('/expenses?stats=monthly');
      setMonthlyStats(res.data);
    } catch (err) {
      setError('Failed to fetch monthly stats');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchMonthlyStats();
    // eslint-disable-next-line
  }, [filter]);

  // Add or update expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/expenses/${editId}`, {
          ...form,
          date: form.date
        });
        setEditId(null);
      } else {
        await api.post('/expenses', {
          ...form,
          date: form.date
        });
      }
      setForm({ amount: '', category: '', date: dayjs().format('YYYY-MM-DD'), description: '' });
      fetchExpenses();
      fetchMonthlyStats();
    } catch (err) {
      setError('Failed to save expense');
    }
  };

  // Edit expense
  const handleEdit = (exp) => {
    setEditId(exp.id);
    setForm({
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      description: exp.description
    });
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
      fetchMonthlyStats();
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Chart data
  const chartData = {
    labels: monthlyStats.map(stat => `${stat.year}-${String(stat.month).padStart(2, '0')}`),
    datasets: [
      {
        label: 'Total Spent',
        data: monthlyStats.map(stat => stat.totalAmount),
        backgroundColor: 'rgba(79, 140, 255, 0.7)', // blue accent
        borderRadius: 8,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181a20] to-[#23263a] text-white py-8 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-blue-400">Dashboard</h2>
          <button onClick={handleLogout} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">Logout</button>
        </div>

        {/* Add Expense Form */}
        <div className="bg-[#23263a] rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-purple-400">Add Expense</h3>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              required
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
            />
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              required
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-40"
            >
              <option value="" disabled>Category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
              {editId ? 'Update' : 'Add'}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="bg-[#23263a] rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Filters</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <select
              value={filter.category}
              onChange={e => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-40"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="date"
              value={filter.start}
              onChange={e => setFilter({ ...filter, start: e.target.value })}
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filter.end}
              onChange={e => setFilter({ ...filter, end: e.target.value })}
              className="px-4 py-2 rounded-lg bg-[#181a20] text-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => setFilter({ category: '', start: '', end: '' })} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition">Clear</button>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-[#23263a] rounded-2xl shadow-lg p-6 mb-8 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">Expenses</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-blue-400 border-b border-gray-700">
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} className="border-b border-gray-800 hover:bg-[#181a20] transition">
                  <td className="py-2 px-4">{exp.amount}</td>
                  <td className="py-2 px-4">{exp.category}</td>
                  <td className="py-2 px-4">{exp.date}</td>
                  <td className="py-2 px-4">{exp.description}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button onClick={() => handleEdit(exp)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Edit</button>
                    <button onClick={() => handleDelete(exp.id)} className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Report Chart */}
        <div className="bg-[#23263a] rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Monthly Report</h3>
          <div className="max-w-xl mx-auto">
            <Bar data={chartData} options={{
              plugins: {
                legend: { labels: { color: '#a259ff' } },
                title: { display: false }
              },
              scales: {
                x: { ticks: { color: '#4f8cff' }, grid: { color: '#23263a' } },
                y: { ticks: { color: '#fff' }, grid: { color: '#23263a' } }
              }
            }} />
          </div>
        </div>

        {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
      </div>
    </div>
  );
}