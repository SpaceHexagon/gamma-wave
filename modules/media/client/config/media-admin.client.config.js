(function () {
  'use strict';

  // Configuring the Media Admin module
  angular
    .module('media.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Media',
      state: 'admin.media.list'
    });
  }
}());
