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
describe('Media CRUD tests', function () {

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

  it('should not be able to save an media if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/media')
          .send(media)
          .expect(403)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Call the assertion callback
            done(mediaSaveErr);
          });

      });
  });

  it('should not be able to save an media if not logged in', function (done) {
    agent.post('/api/media')
      .send(media)
      .expect(403)
      .end(function (mediaSaveErr, mediaSaveRes) {
        // Call the assertion callback
        done(mediaSaveErr);
      });
  });

  it('should not be able to update an media if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/media')
          .send(media)
          .expect(403)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Call the assertion callback
            done(mediaSaveErr);
          });
      });
  });

  it('should be able to get a list of media if not signed in', function (done) {
    // Create new media model instance
    var mediaObj = new Media(media);

    // Save the media
    mediaObj.save(function () {
      // Request media
      agent.get('/api/media')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single media if not signed in', function (done) {
    // Create new media model instance
    var mediaObj = new Media(media);

    // Save the media
    mediaObj.save(function () {
      agent.get('/api/media/' + mediaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', media.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single media with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/media/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Media is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single media which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent media
    agent.get('/api/media/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No media with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an media if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/media')
          .send(media)
          .expect(403)
          .end(function (mediaSaveErr, mediaSaveRes) {
            // Call the assertion callback
            done(mediaSaveErr);
          });
      });
  });

  it('should not be able to delete an media if not signed in', function (done) {
    // Set media user
    media.user = user;

    // Create new media model instance
    var mediaObj = new Media(media);

    // Save the media
    mediaObj.save(function () {
      // Try deleting media
      agent.delete('/api/media/' + mediaObj._id)
        .expect(403)
        .end(function (mediaDeleteErr, mediaDeleteRes) {
          // Set message assertion
          (mediaDeleteRes.body.message).should.match('User is not authorized');

          // Handle media error error
          done(mediaDeleteErr);
        });

    });
  });

  it('should be able to get a single media that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new media
          agent.post('/api/media')
            .send(media)
            .expect(200)
            .end(function (mediaSaveErr, mediaSaveRes) {
              // Handle media save error
              if (mediaSaveErr) {
                return done(mediaSaveErr);
              }

              // Set assertions on new media
              (mediaSaveRes.body.title).should.equal(media.title);
              should.exist(mediaSaveRes.body.user);
              should.equal(mediaSaveRes.body.user._id, orphanId);

              // force the media to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(mediaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single media if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new media model instance
    var mediaObj = new Media(media);

    // Save the media
    mediaObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/media/' + mediaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', media.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single media, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'mediaowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Media
    var _mediaOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _mediaOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Media
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new media
          agent.post('/api/media')
            .send(media)
            .expect(200)
            .end(function (mediaSaveErr, mediaSaveRes) {
              // Handle media save error
              if (mediaSaveErr) {
                return done(mediaSaveErr);
              }

              // Set assertions on new media
              (mediaSaveRes.body.title).should.equal(media.title);
              should.exist(mediaSaveRes.body.user);
              should.equal(mediaSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (mediaInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
