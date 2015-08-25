var request = require('supertest');

var app = require('~/hello-jenkins/app.js');

describe('GET /', function() {
  it('respond with index page', function(done) {
    request(app).get('/').expect(200, done);
  });
});

describe('POST /api/upload', function() {
  it('respond with success', function(done) {
    request(app).post('/api/upload').expect(200, done);
  });
});