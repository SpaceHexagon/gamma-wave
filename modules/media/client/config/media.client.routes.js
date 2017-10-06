(function () {
  'use strict';

  angular
    .module('media.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('media', {
        abstract: true,
        url: '/media',
        template: '<ui-view/>'
      })
      .state('media.list', {
        url: '',
        templateUrl: '/modules/media/client/views/list-media.client.view.html',
        controller: 'MediaListController',
        controllerAs: 'vm'
      })
      .state('media.view', {
        url: '/:mediaId',
        templateUrl: '/modules/media/client/views/view-media.client.view.html',
        controller: 'MediaController',
        controllerAs: 'vm',
        resolve: {
          mediaResolve: getMedia
        },
        data: {
          pageTitle: '{{ mediaResolve.title }}'
        }
      });
  }

  getMedia.$inject = ['$stateParams', 'MediaService'];

  function getMedia($stateParams, MediaService) {
    return MediaService.get({
      mediaId: $stateParams.mediaId
    }).$promise;
  }
}());
