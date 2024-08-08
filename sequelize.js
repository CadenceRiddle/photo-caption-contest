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
  },
  userID: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  },
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
})

User.sync({alter: true})
  .then(() => {
    console.log('User model synced successfully');
  })
  .catch((err) => {
    console.log('Failed to sync the user model');
  });

Photo.sync({alter: true}).then(() => {
  console.log('Photo model synced successfully')
}).catch((err) => {
  console.log('Failed to sync to photo model')
});

module.exports = { 
  sequelize,
  Photo,
  User
}