const express = require('express');
const app = express();
const PORT = 3000;

// Import the separated routes
const photoRoutes = require('./photo_routes');
const userRoutes = require('./user_routes');

app.use(express.json());

// Use the separated routes
app.use('/api', photoRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
