(function () {
  'use strict';

  angular
    .module('media')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Media',
      state: 'media',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'media', {
      title: 'List Media',
      state: 'media.list',
      roles: ['*']
    });
  }
}());
