const request = require('supertest');
const express = require('express');
const userRoutes = require('../user_routes');
const { sequelize, User } = require('../sequelize');

let expect;

// Dynamically import chai and extract expect
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('User Routes', () => {
  before(async () => {
    // Sync the database and create the necessary tables
    await sequelize.sync({ force: true });
  });

  after(async () => {
    // Close the database connection after tests
    await sequelize.close();
  });

  describe('POST /api/user', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/user')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('username', 'testuser');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /api/user/:username', () => {
    it('should return a user by username', async () => {
      const user = await User.create({
        username: 'testuser2',
        password: 'password123',
      });

      const res = await request(app).get(`/api/user/${user.username}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('username', 'testuser2');
    });

    it('should return 404 if user is not found', async () => {
      const res = await request(app).get('/api/user/nonexistentuser');
      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /api/user/:username', () => {
    it('should delete a user by username', async () => {
      const user = await User.create({
        username: 'testuser3',
        password: 'password123',
      });

      const res = await request(app).delete(`/api/user/${user.username}`);
      expect(res.status).to.equal(200);

      const deletedUser = await User.findOne({ where: { username: user.username } });
      expect(deletedUser).to.be.null;
    });

    it('should return 404 if user is not found', async () => {
      const res = await request(app).delete('/api/user/nonexistentuser');
      expect(res.status).to.equal(404);
    });
  });
});
