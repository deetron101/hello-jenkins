var request = require('supertest');
var expect = require('chai').should();
var app = require('../app.js');
var mongoose    = require('mongoose');

describe('GET /', function() {
  it('should respond with index page', function(done) {
    request(app)
    .get('/')
    .expect(200, done);
  });
});

var testUser = {
  name: "Test",
  email: "test@test.com",
  password: "password"
};

describe('POST /api/register', function() {

  before(function(done) {
    for (var i in mongoose.connection.collections) {
      console.log(i);
      mongoose.connection.collections[i].remove();
    }
    done();
  });

  it('should respond with success', function(done) {
    request(app)
    .post('/api/register')
    .send(testUser)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

});

var token = null;

describe('POST /api/auth', function() {
  it('should respond with success', function(done) {
    request(app)
    .post('/api/auth')
    .send(testUser)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('token');
      token = res.body.token;
      token.should.be.a('string');
      done();
    });
  });
});

describe('GET /api/me', function() {
  it('should respond with user info', function(done) {
    request(app)
    .get('/api/me')
    .set('Authorization', 'Bearer '+token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('user').and.be.instanceof(Object);
      res.body.user.email.should.equal(testUser.email);
      res.body.user.name.should.equal(testUser.name);
      done();
    });
  });
});

describe('GET /api/users', function() {
  it('should respond with users', function(done) {
    request(app)
    .get('/api/users')
    .set('Authorization', 'Bearer '+token)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('users').and.be.instanceof(Array);
      res.body.users[0].email.should.equal(testUser.email);
      done();
    });
  });
});

/* describe('POST /api/upload', function() {
  it('should respond with success', function(done) {
    request(app).post('/api/upload').expect(200);
    done();
  });
});*/