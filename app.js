const express = require('express');
const app = express();
const PORT = 3000;
const { User, Photo } = require('./sequelize');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
app.use(express.json());

// Create photo
app.post('/photo', upload.single('picture'), async (req, res, next) => {
  try {
    const { username, description } = req.body;
    const picture = req.file.buffer;
    const newPhoto = await Photo.create({
      username,
      picture,
      description
    })
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

// Get all photos
app.get('/photos', async(req, res, next) => {
  try{
    const photos = await Photo.findAll();
    res.status(200).json(photos);
  }
  catch(err){
    res.status(400).json({error: err.message});
  }
});

// Get photos based on username
app.get('/photo/:username', async(req, res, next) => {
  try{
    const username = req.params.username;
    const target = await Photo.findAll({
      where: {
        username 
      }
    });

    if(target){
      res.status(200).json(target);
    }
    else(
      res.status(404).json({error: "user not found"})
    );
  }
  catch(err){
    res.status(400).json({error: err.message});
  }
})

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

// Show user based on Username
app.get('/user/:username', async (req, res, next) => {
  try{
    const username = req.params.username
    const target = await User.findOne({
      where:{
        username
      }
    });
    if(target){
    res.status(200).json(target);
    }
    else(
      res.status(404).json({error: 'user not found'})
    )
  }
  catch(err){
    res.status(400).json({error: err.message});
  };
});

// Delete User

app.delete('/user/:username', async (req, res, next)=>{
  try{
    const username = req.params.username;
    const target = await User.findOne({
      where: {
        username
      }
    });

    if(target){
      await target.destroy();
      res.status(200).json({message: "user deleted successfully"});
    }
    else(
      res.status(404).json({error: "user not found"})
    );
  }
  catch(err){
    res.status(400).json({error: err.message});
  };
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
