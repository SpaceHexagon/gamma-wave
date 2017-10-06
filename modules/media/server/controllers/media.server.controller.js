'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Media = mongoose.model('Media'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an media
 */
exports.create = function (req, res) {
  var media = new Media(req.body);
  media.user = req.user;

  media.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(media);
    }
  });
};

/**
 * Show the current media
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var media = req.media ? req.media.toJSON() : {};

  // Add a custom field to the Media, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Media model.
  media.isCurrentUserOwner = !!(req.user && media.user && media.user._id.toString() === req.user._id.toString());

  res.json(media);
};

/**
 * Update an media
 */
exports.update = function (req, res) {
  var media = req.media;

  media.title = req.body.title;
  media.content = req.body.content;

  media.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(media);
    }
  });
};

/**
 * Delete an media
 */
exports.delete = function (req, res) {
  var media = req.media;

  media.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(media);
    }
  });
};

/**
 * List of Media
 */
exports.list = function (req, res) {
  Media.find().sort('-created').populate('user', 'displayName').exec(function (err, media) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(media);
    }
  });
};

/**
 * Media middleware
 */
exports.mediaByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Media is invalid'
    });
  }

  Media.findById(id).populate('user', 'displayName').exec(function (err, media) {
    if (err) {
      return next(err);
    } else if (!media) {
      return res.status(404).send({
        message: 'No media with that identifier has been found'
      });
    }
    req.media = media;
    next();
  });
};
