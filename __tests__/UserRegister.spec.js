const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

// initialise a database
beforeAll(() => {
  return sequelize.sync();
});

// to clear the database before each test
beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe('User registration', () => {
  it('returns 200 OK when signup request is valid', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'P4ssword',
      })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });

  it('returns success message when signup request is valid', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'P4ssword',
      })
      .then((response) => {
        expect(response.body.message).toBe('User Created');
        done();
      });
  });
  it('saves the user to the database', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'P4ssword',
      })
      .then(() => {
        //query user table
        User.findAll().then((userList) => {
          expect(userList.length).toBe(1);
          done();
        });
      });
  });
  it('saves the username and email to the database', (done) => {
    request(app)
      .post('/api/1.0/users')
      .send({
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'P4ssword',
      })
      .then(() => {
        User.findAll().then((userList) => {
          const savedUser = userList[0];
          expect(savedUser.username).toBe('user1');
          expect(savedUser.email).toBe('user1@gmail.com');
          done();
        });
      });
  });
});
