(function () {
  'use strict';

  angular
    .module('media')
    .controller('MediaListController', MediaListController);

  MediaListController.$inject = ['MediaService'];

  function MediaListController(MediaService) {
    var vm = this;

    vm.media = MediaService.query();
  }
}());
