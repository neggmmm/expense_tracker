import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ amount: '', category: '', date: dayjs(), description: '' });
  const [filter, setFilter] = useState({ category: '', start: null, end: null });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categories, setCategories] = useState(['Food', 'Groceries', 'Transport', 'Utilities', 'Other']);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch expenses and monthly stats
  const fetchExpenses = async () => {
    try {
      let url = '/expenses?';
      if (filter.category) url += `category=${filter.category}&`;
      if (filter.start) url += `start=${dayjs(filter.start).format('YYYY-MM-DD')}&`;
      if (filter.end) url += `end=${dayjs(filter.end).format('YYYY-MM-DD')}&`;
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
          date: dayjs(form.date).format('YYYY-MM-DD')
        });
        setEditId(null);
      } else {
        await api.post('/expenses', {
          ...form,
          date: dayjs(form.date).format('YYYY-MM-DD')
        });
      }
      setForm({ amount: '', category: '', date: dayjs(), description: '' });
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
      date: dayjs(exp.date),
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
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
        <h2>Dashboard</h2>
        <Button variant="contained" color="secondary" onClick={handleLogout} style={{ float: 'right' }}>Logout</Button>
        <h3>Add Expense</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <TextField
            label="Amount"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            required
          />
          <Select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            displayEmpty
            required
            style={{ minWidth: 120 }}
          >
            <MenuItem value="" disabled>Category</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
          <DatePicker
            label="Date"
            value={form.date}
            onChange={date => setForm({ ...form, date })}
            format="YYYY-MM-DD"
            required
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary">
            {editId ? 'Update' : 'Add'}
          </Button>
        </form>

        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <Select
            value={filter.category}
            onChange={e => setFilter({ ...filter, category: e.target.value })}
            displayEmpty
            style={{ minWidth: 120 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
          <DatePicker
            label="Start Date"
            value={filter.start}
            onChange={date => setFilter({ ...filter, start: date })}
            format="YYYY-MM-DD"
          />
          <DatePicker
            label="End Date"
            value={filter.end}
            onChange={date => setFilter({ ...filter, end: date })}
            format="YYYY-MM-DD"
          />
          <Button variant="outlined" onClick={() => setFilter({ category: '', start: null, end: null })}>Clear</Button>
        </div>

        <h3>Expenses</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map(exp => (
                <TableRow key={exp.id}>
                  <TableCell>{exp.amount}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>{exp.date}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(exp)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(exp.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <h3>Monthly Report</h3>
        <div style={{ maxWidth: 600 }}>
          <Bar data={chartData} />
        </div>

        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </div>
    </LocalizationProvider>
  );
}