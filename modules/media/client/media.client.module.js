(function (app) {
  'use strict';

  app.registerModule('media', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('media.admin', ['core.admin']);
  app.registerModule('media.admin.routes', ['core.admin.routes']);
  app.registerModule('media.services');
  app.registerModule('media.routes', ['ui.router', 'core.routes', 'media.services']);
}(ApplicationConfiguration));
