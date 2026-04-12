const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Todo = new Schema({
    title:     { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId:    { type: ObjectId, ref: 'User', required: true },
});

const UserModel = mongoose.model("User", User);
const TodoModel = mongoose.model("Todo", Todo);

module.exports = { UserModel, TodoModel };