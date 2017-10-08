(function () {
  'use strict';
  var vm = null,
    notif = null;
  angular
    .module('media.admin')
    .controller('MediaAdminController', MediaAdminController)
    .directive('onFileChange', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var onChangeHandler = scope.$eval(attrs.onFileChange);
          element.bind('change', function () {
            scope.$apply(function () {
              var files = element[0].files;
              if (files) {
                upload(files);
              }
            });
          });
        }
      };
    });

  MediaAdminController.$inject = ['$scope', '$state', '$window', 'mediaResolve', 'Authentication', 'Notification'];

  function upload(files) { // hack to work around broken file input binding in angularjs 1.x
    // get file input
    // var files = document.querySelector("input[type=file]").files
    console.warn('upload', files);
    function successCallback(res) {
      vm.fileId = res;
      notif.success({ message: '<i class="glyphicon glyphicon-ok"></i> Media uploaded successfully!' });
    }

    function errorCallback(res) {
      notif.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Upload Failed' });
    }
    vm.media.upload(files[0], successCallback, errorCallback);
  }

  function MediaAdminController($scope, $state, $window, media, Authentication, Notification) {
    vm = this;
    vm.media = media;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.upload = upload;
    vm.fileId = '';
    notif = Notification;
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
      // set fileId
      var fileId = vm.fileId;
      vm.media.fileId = fileId;
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
