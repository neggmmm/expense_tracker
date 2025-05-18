# Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and MySQL.

## Features

- User authentication and authorization
- Track expenses and income
- Categorize transactions
- View expense history and analytics
- Secure data storage

## Tech Stack

### Frontend
- React
- Modern UI/UX
- Responsive design

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication

## Project Structure

```
expense-tracker/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
│   ├── config/       # Database and app configuration
│   ├── models/       # Database models
│   ├── migrations/   # Database migrations
│   └── seeders/      # Database seeders
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/neggmmm/expense-tracker.git
cd expense-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
- Create a `.env` file in the backend directory
- Add the following variables:
  ```
  DB_HOST=localhost
  DB_USER=your_mysql_username
  DB_PASSWORD=your_mysql_password
  DB_NAME=expense_tracker_db
  DB_PORT=3306
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 