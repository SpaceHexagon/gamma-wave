'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Media = mongoose.model('Media'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  media;

/**
 * Media routes tests
 */
describe('Media Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new media
    user.save()
      .then(function () {
        media = {
          title: 'Media Title',
          content: 'Media Content'
        };

        done();
      })
      .catch(done);
  });

  it('should be able to save an media if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new media
        agent.post('/api/media')
          .send(media)
          .expect(200)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Handle media save error
            if (mediaSaveErr) {
              return done(mediaSaveErr);
            }

            // Get a list of media
            agent.get('/api/media')
              .end(function (mediaGetErr, mediaGetRes) {
                // Handle media save error
                if (mediaGetErr) {
                  return done(mediaGetErr);
                }

                // Get media list
                var media = mediaGetRes.body;

                // Set assertions
                (media[0].user._id).should.equal(userId);
                (media[0].title).should.match('Media Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an media if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new media
        agent.post('/api/media')
          .send(media)
          .expect(200)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Handle media save error
            if (mediaSaveErr) {
              return done(mediaSaveErr);
            }

            // Update media title
            media.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing media
            agent.put('/api/media/' + mediaSaveRes.body._id)
              .send(media)
              .expect(200)
              .end(function (mediaUpdateErr, mediaUpdateRes) {
                // Handle media update error
                if (mediaUpdateErr) {
                  return done(mediaUpdateErr);
                }

                // Set assertions
                (mediaUpdateRes.body._id).should.equal(mediaSaveRes.body._id);
                (mediaUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an media if no title is provided', function (done) {
    // Invalidate title field
    media.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new media
        agent.post('/api/media')
          .send(media)
          .expect(422)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Set message assertion
            (mediaSaveRes.body.message).should.match('Title cannot be blank');

            // Handle media save error
            done(mediaSaveErr);
          });
      });
  });

  it('should be able to delete an media if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new media
        agent.post('/api/media')
          .send(media)
          .expect(200)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Handle media save error
            if (mediaSaveErr) {
              return done(mediaSaveErr);
            }

            // Delete an existing media
            agent.delete('/api/media/' + mediaSaveRes.body._id)
              .send(media)
              .expect(200)
              .end(function (mediaDeleteErr, mediaDeleteRes) {
                // Handle media error error
                if (mediaDeleteErr) {
                  return done(mediaDeleteErr);
                }

                // Set assertions
                (mediaDeleteRes.body._id).should.equal(mediaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single media if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new media model instance
    media.user = user;
    var mediaObj = new Media(media);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new media
        agent.post('/api/media')
          .send(media)
          .expect(200)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Handle media save error
            if (mediaSaveErr) {
              return done(mediaSaveErr);
            }

            // Get the media
            agent.get('/api/media/' + mediaSaveRes.body._id)
              .expect(200)
              .end(function (mediaInfoErr, mediaInfoRes) {
                // Handle media error
                if (mediaInfoErr) {
                  return done(mediaInfoErr);
                }

                // Set assertions
                (mediaInfoRes.body._id).should.equal(mediaSaveRes.body._id);
                (mediaInfoRes.body.title).should.equal(media.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (mediaInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    Media.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
