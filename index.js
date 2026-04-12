const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

require("dotenv").config();

const { UserModel, TodoModel } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
.connect(MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
});

// Auth Middleware
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({
            message: "Token missing"
        });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.username = decodedData.username;
        req.userId = decodedData.userId;
        next();
    } catch (error) {
        return res.status(403).json({
            message: 'Unauthorized'
        })
    }
}

//SIGNUP ROUTE
app.post('/signup', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
    return res.status(400).json({
        message: "Username and password required"
    });
}
    try {
        const exisitingUser = await UserModel.findOne({
            username
        });

        if(exisitingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username,
            password : hashedPassword,
        });

        res.json({
            message: "Signup successful"
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//SIGNIN ROUTE
app.post('/signin', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await UserModel.findOne({ username });

        if (!foundUser) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password);

        if(!passwordMatch) {
            return res.status(403).json({ message: 'Invalid username or password' });
        }
        
    const token = jwt.sign(
        { userId: foundUser._id, username: foundUser.username },
        JWT_SECRET
    )

    res.json({
        message: "Signin successful",
        token
    });
    } catch(err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


// GET ME ROUTE
app.get('/me', auth,async function (req, res) {
   try {
    const foundUser = await UserModel.findOne({ username: req.username });

    if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

    res.json({ username: foundUser.username });
   } catch(err) {
        res.status(500).json({ message: 'Internal server error' });
   }
});

//CREATE TODO
app.post('/todos', auth, async function (req, res) {
    const { title } = req.body;

    if(!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {
        const newTodo = await TodoModel.create({
            title,
            completed: false,
            userId: req.userId,
        });

        res.json({
            message: 'Todo created',
            todo : {
                id: newTodo._id,
                title: newTodo.title,
                completed: newTodo.completed,
            },
        }) 
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//GET ALL TODOS
app.get('/todos', auth, async function (req, res) {
    try {
        const userTodos = await TodoModel.find({ userId: req.userId });

        res.json({
            todos: userTodos.map((t) => ({
                id: t._id,
                title: t.title,
                completed: t.completed,
            })),
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

// UPDATE TODO (mark as done)
app.put('/todos/:id', auth, async function (req, res) {
    const { id } = req.params;

    try {
        const todo = await TodoModel.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { completed: true },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({
            message : 'Todo updated',
            todo : {
                id: todo._id,
                title: todo.title,
                completed: todo.completed,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


//DELETE TODO
app.delete('/todos/:id', auth, async function (req, res) {
    const { id } = req.params;

    try {
        const todo = await TodoModel.findOneAndDelete({ _id: id, userId: req.userId });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});

//const hashedpassword = await bcrypt.hash(password, 5);
//bycrypt.compare
