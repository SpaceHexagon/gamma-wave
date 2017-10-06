(function () {
  'use strict';

  angular
    .module('media')
    .controller('MediaController', MediaController);

  MediaController.$inject = ['$scope', 'mediaResolve', 'Authentication'];

  function MediaController($scope, media, Authentication) {
    var vm = this;

    vm.media = media;
    vm.authentication = Authentication;

  }
}());
