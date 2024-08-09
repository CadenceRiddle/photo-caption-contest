const express = require('express');
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const PORT = 3000;

// Import the separated routes
const photoRoutes = require('./photo_routes');
const userRoutes = require('./user_routes');
const encryption = require('./encryption');
const { sequelize } = require('./sequelize');

const sessionStore = new SequelizeStore({ db: sequelize });

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1800000 } // Session expires after 30 minutes of inactivity
}));
sessionStore.sync();

// Use the separated routes
app.use('/api', photoRoutes);
app.use('/api', userRoutes);
app.use('/api', encryption);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
