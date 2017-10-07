(function () {
  'use strict';

  angular
    .module('media.services')
    .factory('MediaService', MediaService);

  MediaService.$inject = ['$resource', '$log', '$http'];

  function MediaService($resource, $log, $http) {
    var Media = $resource('/api/media/:mediaId', {
      mediaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Media.prototype, {
      createOrUpdate: function () {
        var media = this;
        return createOrUpdate(media);
      },
      upload: function () {
        var media = this;
        return upload(media);
      }
    });

    return Media;

    function createOrUpdate(media) {
      if (media._id) {
        return media.$update(onSuccess, onError);
      } else {
        return media.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(media) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function upload(done, fail) {
      var uploadUrl = '/api/files',
        fileInput = document.querySelector('input[name=file]'),
        fd = new FormData(),
        file = fileInput.files[0];
      fd.append('file', file);
      return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      })
      .success(function (fileId) {
        onSuccess(fileId);
      })
      .error(function (error) {
        onError(error);
      });
      // Handle successful response
      function onSuccess(fileId) {
        // send file id back
        done(fileId);
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
        fail(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
