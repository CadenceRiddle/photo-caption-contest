const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('./sequelize'); 
const crypto = require('crypto');


const saltRounds = 10;
const jwtSecret = crypto.randomBytes(64).toString('hex');

router.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use the authenticateToken middleware to protect routes
router.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'You have accessed a protected route', user: req.user });
});

router.post('/register', async (req, res, next) => {
  try{ 
    const { username, password, age } = req.body;
    const existingUser = await User.findOne({
      where: {
        username
      }
    });
    if(existingUser){
      res.status(400).json({error: "user already exists"})
    };

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      age
    });

    res.status(201).json({
      message: "user registered successfully",
      user: newUser
    });

  }
  catch(err){
    res.status(400).json({error: err.message})
  };
});

router.post('/login', async (req, res, next) => {
  try{
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username
      }
    });

    if(!user){
      res.status(404).json({error: "user does not exist"});
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
      res.status(404).json({error: "password is not correct"})
    }

    const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h'});
    res.status(200).json({message: "login successful", token});
  }
  catch(err){
    res.status(400).json({error: err.message});
  };
});

router.post('/logout', async (req, res, next) => {
  res.status(200).json({message: "logout successful"});
})

module.exports = router;