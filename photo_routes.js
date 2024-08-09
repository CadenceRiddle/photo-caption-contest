const express = require('express');
const router = express.Router();
const { Photo } = require('./sequelize');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(express.json());

// Create photo
router.post('/photo', upload.single('picture'), async (req, res, next) => {
  try {
    const { username, description } = req.body;
    const picture = req.file.buffer;
    const newPhoto = await Photo.create({
      username,
      picture,
      description,
    });
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all photos
router.get('/photos', async (req, res, next) => {
  try {
    const photos = await Photo.findAll();
    res.status(200).json(photos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get photos based on username
router.get('/photos/username/:username', async (req, res, next) => {
  try {
    const username = req.params.username;
    const target = await Photo.findAll({
      where: {
        username,
      },
    });

    if (target.length > 0) {
      res.status(200).json(target);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get photo by the id
router.get('/photo/id/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const target = await Photo.findOne({
      where: {
        id,
      },
    });
    if (target) {
      res.status(200).json(target);
    } else {
      res.status(404).json({ error: 'Photo not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update the description on a photo
router.put('/photo/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { description } = req.body;
    const target = await Photo.findOne({
      where: {
        id,
      },
    });
    if (target) {
      target.description = description;
      await target.save();
      res.status(200).json(target);
    } else {
      res.status(404).json({ error: 'Photo not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete photo
router.delete('/photo/id/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const target = await Photo.findOne({
      where: {
        id,
      },
    });
    if (target) {
      await target.destroy();
      res.status(200).json({ message: 'Photo deleted successfully' });
    } else {
      res.status(404).json({ error: 'Photo not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
