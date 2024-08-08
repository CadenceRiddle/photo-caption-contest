const express = require('express');
const app = express();
const PORT = 3000;
const Sequelize = require('sequelize');
const sequelize = new Sequelize('photo-caption-contest', 'postgres', 'Ga11ego$0908', {
  dialect: 'postgres'
});

sequelize.authenticate().then(() => {
  console.log('Connected successfully to database')
}).catch((err) =>{
  console.log('did  not connect')
})

const User = sequelize.define('user', {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.DataTypes.STRING
  },
  age: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 21
  }
});

const Photo = sequelize.define('photo', {
  username: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  picture: {
    type: Sequelize.DataTypes.BLOB('long'),
    allowNull: false,
  },
  description: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  }
})

User.sync()
  .then(() => {
    console.log('User model synced successfully');
  })
  .catch((err) => {
    console.log('Failed to sync the user model');
  });

Photo.sync().then(() => {
  console.log('Photo model synced successfully')
}).catch((err) => {
  console.log('Failed to sync to photo model')
});

app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
});