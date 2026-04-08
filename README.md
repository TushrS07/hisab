# hisab - Loan Management System

**hisab** is a simple and efficient MERN (MongoDB, Express, React, Node.js) application designed to manage loans, track users, and handle financial records (vouchers).

## 🚀 Features

-   **Admin Authentication:** Secure login for managing records.
-   **User Management:** Add and view user profiles with contact information.
-   **Loan Tracking:** Record loans with details like amount, interest rate, voucher number, and date.
-   **Dashboard:** Overview of financial records and user activities.
-   **Search & Details:** View specific user loan histories and add new entries easily.

## 🛠️ Tech Stack

-   **Frontend:** React (Vite), React Router, Axios, CSS.
-   **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
-   **Authentication:** JSON Web Tokens (JWT) for secure API access.

---

## 📂 Project Structure

```
hisab/
├── backend/            # Express server, MongoDB models, & API routes
│   ├── config/         # Database configuration
│   ├── controllers/    # API logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   └── routes/         # Express routes
└── client/             # React frontend (Vite)
    ├── src/
    │   ├── api/        # Axios configuration
    │   ├── components/ # Reusable UI components
    │   └── pages/      # Application views/routes
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
-   [Node.js](https://nodejs.org/) installed.
-   [MongoDB](https://www.mongodb.com/) account (or local MongoDB instance).

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```
Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Navigate to the `client` folder:
```bash
cd client
npm install
```
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5001/api
```
Start the development server:
```bash
npm run dev
```

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/login` - Login admin.

### Users
- `GET /api/users` - Get all users (Protected).
- `POST /api/users` - Create a new user (Protected).

### Loans
- `GET /api/loans/:userName` - Get loans for a specific user (Protected).
- `POST /api/loans` - Add a new record (Protected).

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License
This project is licensed under the [ISC License](LICENSE).
