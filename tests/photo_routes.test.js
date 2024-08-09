const request = require('supertest');
const express = require('express');
const photoRoutes = require('../photo_routes');
const { sequelize, Photo } = require('../sequelize');

let expect;

// Dynamically import chai and extract expect
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();

const app = express();
app.use(express.json());
app.use('/api', photoRoutes);

describe('Photo Routes', () => {
  before(async () => {
    // Sync the database and create the necessary tables
    await sequelize.sync({ force: true });
  });

  after(async () => {
    // Close the database connection after tests
    await sequelize.close();
  });

  describe('POST /api/photo', () => {
    it('should create a new photo', async () => {
      const res = await request(app)
        .post('/api/photo')
        .attach('picture', Buffer.from('test image'), 'test.jpg')
        .field('username', 'testuser')
        .field('description', 'Test description');

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('username', 'testuser');
      expect(res.body).to.have.property('description', 'Test description');
    });
  });

  describe('GET /api/photos', () => {
    it('should return all photos', async () => {
      const res = await request(app).get('/api/photos');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /api/photo/id/:id', () => {
    it('should return a photo by id', async () => {
      const photo = await Photo.create({
        username: 'testuser2',
        picture: Buffer.from('test image 2'),
        description: 'Test description 2',
      });

      const res = await request(app).get(`/api/photo/id/${photo.id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('username', 'testuser2');
      expect(res.body).to.have.property('description', 'Test description 2');
    });

    it('should return 404 if photo is not found', async () => {
      const res = await request(app).get('/api/photo/id/9999');
      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /api/photo/:id', () => {
    it('should update the description of a photo', async () => {
      const photo = await Photo.create({
        username: 'testuser3',
        picture: Buffer.from('test image 3'),
        description: 'Old description',
      });

      const res = await request(app)
        .put(`/api/photo/${photo.id}`)
        .send({ description: 'New description' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('description', 'New description');
    });

    it('should return 404 if photo is not found', async () => {
      const res = await request(app)
        .put('/api/photo/9999')
        .send({ description: 'Nonexistent description' });

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /api/photo/id/:id', () => {
    it('should delete a photo by id', async () => {
      const photo = await Photo.create({
        username: 'testuser4',
        picture: Buffer.from('test image 4'),
        description: 'Test description 4',
      });

      const res = await request(app).delete(`/api/photo/id/${photo.id}`);
      expect(res.status).to.equal(200);

      const deletedPhoto = await Photo.findByPk(photo.id);
      expect(deletedPhoto).to.be.null;
    });

    it('should return 404 if photo is not found', async () => {
      const res = await request(app).delete('/api/photo/id/9999');
      expect(res.status).to.equal(404);
    });
  });
});
