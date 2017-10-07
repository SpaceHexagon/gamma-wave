(function () {
  'use strict';

  angular
    .module('media.admin')
    .controller('MediaAdminController', MediaAdminController);

  MediaAdminController.$inject = ['$scope', '$state', '$window', 'mediaResolve', 'Authentication', 'Notification'];

  function MediaAdminController($scope, $state, $window, media, Authentication, Notification) {
    var vm = this;

    vm.media = media;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Media
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.media.$remove(function () {
          $state.go('admin.media.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Media deleted successfully!' });
        });
      }
    }

    // Save Media
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mediaForm');
        return false;
      }


      // initiate streaming file upload

      console.info('Before saving: vm.media: ', vm.media);

      // Then do all this stuff
      // Create a new media, or update the current instance
      vm.media.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.media.list'); // should we send the User to the list or the updated Media's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Media saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Media save error!' });
      }
    }
  }
}());
