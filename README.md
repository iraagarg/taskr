# 📝 Taskr — Fullstack TODO Application

A fullstack TODO application with **JWT-based authentication** and **MongoDB persistence**, built with Node.js, Express, and Vanilla JavaScript.

---

## ✨ Features

- 🔐 User Signup & Signin with JWT Authentication
- 🗄️ MongoDB database integration (persistent storage)
- 🧾 Create, view, complete, and delete todos
- 👤 User-specific todos (each user sees only their own)
- 🔒 Protected routes using auth middleware
- 🌐 Clean frontend + backend integration via Axios

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- CORS
- dotenv

### Frontend
- HTML5 & CSS3
- Vanilla JavaScript
- Axios

---

## 📂 Project Structure
```
taskr/
├── index.js          # Express server & all API routes
├── db.js             # Mongoose models (User, Todo)
├── index.html        # Frontend UI
├── .env              # Your local environment variables (gitignored)
├── .env.example      # Environment variable template
├── .gitignore
├── package.json
└── package-lock.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd taskr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
JWT_SECRET=your_secret_key_here
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskr?retryWrites=true&w=majority
```

> **How to get your MONGO_URI:**
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Open your cluster → click **Connect** → choose **Drivers**
> 3. Copy the connection string and replace `<username>` and `<password>` with your Atlas credentials

### 4. Run the server

```bash
node index.js
```

Server starts at: `http://localhost:3000`

### 5. Open the frontend

Open `index.html` directly in your browser.

---

## 🔑 API Reference

### Auth Routes

| Method | Endpoint  | Auth Required | Description       |
|--------|-----------|---------------|-------------------|
| POST   | /signup   | ❌            | Register new user |
| POST   | /signin   | ❌            | Login & get token |
| GET    | /me       | ✅            | Get current user  |

### Todo Routes

| Method | Endpoint      | Auth Required | Description       |
|--------|---------------|---------------|-------------------|
| POST   | /todos        | ✅            | Create a todo     |
| GET    | /todos        | ✅            | Get all your todos|
| PUT    | /todos/:id    | ✅            | Mark todo as done |
| DELETE | /todos/:id    | ✅            | Delete a todo     |

---

## 🔐 How Authentication Works

1. User signs up — credentials saved to MongoDB
2. User signs in — server returns a signed JWT token
3. Token is stored in browser `localStorage`
4. Every protected request sends the token in the `Authorization` header
5. Server verifies the token via middleware before processing the request
6. Todos are linked to users via MongoDB ObjectId — users can only access their own data

---

## 🗄️ Database Schema

### User
```js
{
  username: String, // unique
  password: String
}
```

### Todo
```js
{
  title:     String,
  completed: Boolean,  // default: false
  userId:    ObjectId  // reference to User
}
```

---

## ⚠️ Important Notes

- Passwords are stored as plain text — add **bcrypt** before using in production
- JWT tokens have no expiry set — consider adding `expiresIn` for production
- Make sure your MongoDB Atlas cluster allows connections from your IP address (Network Access settings)

---

## 🚀 Future Improvements

- 🔒 Password hashing with bcrypt
- ⏳ JWT token expiration & refresh tokens
- ⚛️ Migrate frontend to React
- 🌙 Dark mode
- 📱 Improved responsive design
- 🏷️ Todo categories and priorities
- 📅 Due dates for todos

---

## 👩‍💻 Author

Developed by **Iraa Garg**