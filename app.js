const express = require('express');
const app = express();
const PORT = 3000;
const { User, Photo } = require('./sequelize');
app.use(express.json());

// Create photo
app.post('/photo', async (req, res, next) => {
  try {
    const newPhoto = await Photo.create(req.body);
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create user
app.post('/user', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Show all users
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
