const Expense = require('../models/expense');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    const expense = await Expense.create({
      amount,
      category,
      date,
      description,
      UserId: req.user.id
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Error creating expense', error: error.message });
  }
};

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { UserId: req.user.id } });
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching expenses', error: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ where: { id, UserId: req.user.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const { amount, category, date, description } = req.body;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;
    expense.description = description ?? expense.description;
    await expense.save();

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Error updating expense', error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({ where: { id, UserId: req.user.id } });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await expense.destroy();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting expense', error: error.message });
  }
};

// Get a single expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOne({
      where: { id, UserId: req.user.id },
      attributes: ['amount', 'category', 'date', 'description']
    });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching expense', error: error.message });
  }
};