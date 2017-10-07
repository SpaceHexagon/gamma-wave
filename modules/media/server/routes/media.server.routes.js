'use strict';

/**
 * Module dependencies
 */
var mediaPolicy = require('../policies/media.server.policy'),
  media = require('../controllers/media.server.controller');

module.exports = function (app) {
  // Media collection routes
  app.route('/api/media').all(mediaPolicy.isAllowed)
    .get(media.list)
    .post(media.create);

  // Single media routes
  app.route('/api/media/:mediaId').all(mediaPolicy.isAllowed)
    .get(media.read)
    .put(media.update)
    .delete(media.delete);

  app.route('/api/files')
    .post(media.uploadStream);
  app.route('/api/files/:fileId')
    .get(media.readStream);
  // Finish by binding the media middleware
  app.param('mediaId', media.mediaByID);
};
