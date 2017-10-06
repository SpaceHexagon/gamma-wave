(function () {
  'use strict';

  angular
    .module('media.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.media', {
        abstract: true,
        url: '/media',
        template: '<ui-view/>'
      })
      .state('admin.media.list', {
        url: '',
        templateUrl: '/modules/media/client/views/admin/list-media.client.view.html',
        controller: 'MediaAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.media.create', {
        url: '/create',
        templateUrl: '/modules/media/client/views/admin/form-media.client.view.html',
        controller: 'MediaAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          mediaResolve: newMedia
        }
      })
      .state('admin.media.edit', {
        url: '/:mediaId/edit',
        templateUrl: '/modules/media/client/views/admin/form-media.client.view.html',
        controller: 'MediaAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ mediaResolve.title }}'
        },
        resolve: {
          mediaResolve: getMedia
        }
      });
  }

  getMedia.$inject = ['$stateParams', 'MediaService'];

  function getMedia($stateParams, MediaService) {
    return MediaService.get({
      mediaId: $stateParams.mediaId
    }).$promise;
  }

  newMedia.$inject = ['MediaService'];

  function newMedia(MediaService) {
    return new MediaService();
  }
}());
