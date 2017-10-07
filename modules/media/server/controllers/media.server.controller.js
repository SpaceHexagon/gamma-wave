'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Media = mongoose.model('Media'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  shortId = require('shortid'),
  Grid = require('gridfs-stream'),
  Busboy = require('busboy'),
  mongo = require('mongodb'),
  gridDB = new mongo.Db('gamma-wave', new mongo.Server('127.0.0.1', 27017)),
  ObjectID = mongo.ObjectID,
  gfs = null;


gridDB.open(function (err) { // make sure the db instance is open before passing into `Grid`
  if (err) return console.error(err);
  gfs = Grid(gridDB, mongo);
});

/**
 * Create a media file
 */
exports.readStream = function (req, res) {

  var username = req.params.username,
    allFiles = gridDB.collection('files');

  allFiles.find({ filename: req.params.fileId }).toArray(function (err, files) {
    if (err) {
      res.json(err);
    }

    if (files.length > 0) {
      // if (files[0].metadata.public === true) {
      res.set('Content-Type', files[0].contentType);
      var read_stream = gfs.createReadStream({
        root: username,
        filename: req.params.file
      });
      read_stream.pipe(res);
      // } else {
      //   res.status(403).send('Forbidden');
      // }

    } else {
      return res.status(404).send(' ');
    }
  });
};

/**
 * Upload media file
 */
exports.uploadStream = function (req, res) {

  var fileId = new mongo.ObjectId(),
    busboy = new Busboy({
      headers: req.headers
    }),
    username = 'public'; // online[req.headers['x-access-token']];

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('got file', filename, mimetype, encoding);
    var writeStream = gfs.createWriteStream({
      _id: fileId,
      filename: filename,
      root: username,
      mode: 'w',
      content_type: mimetype,
      metadata: {
        public: false,
        modified: Date.now(),
        username: username
      }
    });

    file.pipe(writeStream);
  }).on('finish', function () {
    res.status(200).send(fileId);
  });
  req.pipe(busboy);
};

/**
 * Create media file manually
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
 * Update a media file
 */
exports.update = function (req, res) {
  var media = req.media;

  media.title = req.body.title;
  media.description = req.body.description;

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
 * Delete a media file
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
 * List of Media files
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
