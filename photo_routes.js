const express = require('express');
const router = express.Router();
const { Photo } = require('./sequelize');
const multer = require('multer');
const cache = require('./cache');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(express.json());

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ error: 'You must be logged in to perform this action' });
  }
};

// Create photo
router.post('/photo', upload.single('picture'), isAuthenticated, async (req, res, next) => {
  try {
    const { username, description } = req.body;
    const picture = req.file.buffer;
    const newPhoto = await Photo.create({
      username: req.session.username,
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

    const cachedPhotos = cache.get('allPhotos');
    if (cachedPhotos) {
      console.log('Serving from cache');
      return res.status(200).json(cachedPhotos);
    };

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

    const cachedPhoto = cache.get(`photo_${id}`);
    if (cachedPhoto) {
      console.log('Serving from cache');
      return res.status(200).json(cachedPhoto);
    }

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
router.put('/photo/:id',isAuthenticated, async (req, res, next) => {
  try {
    const id = req.params.id;
    const { description } = req.body;
    const target = await Photo.findOne({
      where: {
        id,
        username: req.session.username
      },
    });
    if (target) {
      target.description = description;
      await target.save();

      cache.del('allPhotos'); // Invalidate the cache for all photos
      cache.del(`photo_${id}`); // Invalidate the cache for this specific photo

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
