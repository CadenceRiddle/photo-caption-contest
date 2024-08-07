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

User.sync()
  .then(() => {
    console.log('Table and model synced successfully');
  })
  .catch((err) => {
    console.error('Failed to sync the model:', err);
  });

app.listen(PORT, () =>{
  console.log(`listening on port ${PORT}`);
});