const express = require('express');
const router = express.Router();
const { User } = require('./sequelize');

router.use(express.json());

// Show all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Show user based on Username
router.get('/user/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    const target = await User.findOne({
      where: {
        username,
      },
    });
    if (target) {
      res.status(200).json(target);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete User
router.delete('/user/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    const target = await User.findOne({
      where: {
        username,
      },
    });

    if (target) {
      await target.destroy();
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
