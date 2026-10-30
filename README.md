# 💰 SpendWise - Personal Expense & Budget Tracker (MERN Stack)

A clean, responsive, full-stack **MERN (MongoDB, Express.js, React, Node.js)** application designed to help individuals monitor personal finances, categorize income and expenses, and visualize spending habits in real time.

---

## 🚀 Key Features

- **🔐 Secure User Authentication**:
  - User registration and login using **JSON Web Tokens (JWT)**.
  - Password encryption using **bcryptjs** (10 salt rounds).
  - Protected API routes with custom auth middleware.
  
- **📊 Real-Time Financial Metrics**:
  - Live calculation of **Total Balance**, **Total Income**, and **Total Expenses**.
  - Visual **Category Breakdown** with percentage calculation of total expenses.

- **⚡ Full CRUD Operations**:
  - Add, View, Edit, and Delete transactions.
  - Categorized into *Income* (Salary, Freelance, Investment, etc.) and *Expense* (Food, Rent, Shopping, Utilities, etc.).

- **🔍 Search & Filter**:
  - Instant client-side search by title/description.
  - Type filters (All, Income, Expense).
  - Sorting by date (Newest/Oldest) and amount (High/Low).

- **📱 Sleek & Responsive UI**:
  - Built with React 18, Vite, modern CSS variables, and Lucide icons.
  - Mobile, tablet, and desktop friendly.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Vite, Axios, Lucide Icons, CSS3 (Modern Flexbox & Grid) |
| **Backend** | Node.js, Express.js, REST API Architecture |
| **Database** | MongoDB, Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs, CORS, Dotenv |

---

## 📂 Project Structure

```
expense-tracker-mern/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── models/
│   │   ├── User.js             # User Mongoose schema
│   │   └── Transaction.js      # Transaction Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js       # Register, login, profile routes
│   │   └── transactionRoutes.js# CRUD & summary analytics routes
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT token verification
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Axios instance with auth interceptor
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BalanceCard.jsx
    │   │   ├── TransactionForm.jsx
    │   │   ├── TransactionList.jsx
    │   │   └── CategoryBreakdown.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state (Login/Register/Logout)
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚡ How to Run Locally

### Prerequisites
1. **Node.js** (v16 or higher) installed on your system.
2. **MongoDB** running locally (`mongodb://127.0.0.1:27017`) OR a free connection string from **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**.

---

### Step 1: Run Backend

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` (already created with defaults):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker_db
   JWT_SECRET=supersecretjwtkey_expensetracker_2024
   ```
   *(If using MongoDB Atlas, replace `MONGO_URI` with your Atlas URI).*

4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   ✅ You should see: `MongoDB Connected` and `Expense Tracker Server is running on port 5000`.

---

### Step 2: Run Frontend

1. Open a **second** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Vite dev server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

5. Register a new account or click the demo helper to start adding your expenses and income!

---

## 🎯 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/me` - Get profile of logged-in user *(Protected)*

### Transactions (`/api/transactions`) *(All Protected)*
- `GET /api/transactions` - Fetch user's transactions (supports `?type=`, `?search=`, `?sortBy=`)
- `GET /api/transactions/summary` - Aggregate metrics (balance, income, expense, category breakdown)
- `POST /api/transactions` - Add a new transaction
- `PUT /api/transactions/:id` - Update existing transaction
- `DELETE /api/transactions/:id` - Delete a transaction
