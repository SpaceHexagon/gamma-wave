(function () {
  'use strict';

  angular
    .module('media.admin')
    .controller('MediaAdminListController', MediaAdminListController);

  MediaAdminListController.$inject = ['MediaService'];

  function MediaAdminListController(MediaService) {
    var vm = this;

    vm.media = MediaService.query();
  }
}());
