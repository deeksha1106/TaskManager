const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mern_tasks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CRUD API
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = new Task({ title: req.body.title });
  await newTask.save();
  res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const updateFields = {};
  if (req.body.title !== undefined) updateFields.title = req.body.title;
  if (req.body.completed !== undefined) updateFields.completed = req.body.completed;

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true }
  );
  res.json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));