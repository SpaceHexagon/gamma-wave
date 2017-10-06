(function () {
  'use strict';

  describe('Media Route Tests', function () {
    // Initialize global variables
    var $scope,
      MediaService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MediaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MediaService = _MediaService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('media');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/media');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('media.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/media/client/views/list-media.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MediaController,
          mockMedia;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('media.view');
          $templateCache.put('/modules/media/client/views/view-media.client.view.html', '');

          // create mock media
          mockMedia = new MediaService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Media about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MediaController = $controller('MediaController as vm', {
            $scope: $scope,
            mediaResolve: mockMedia
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mediaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mediaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mediaId: 1
          })).toEqual('/media/1');
        }));

        it('should attach an media to the controller scope', function () {
          expect($scope.vm.media._id).toBe(mockMedia._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/media/client/views/view-media.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/media/client/views/list-media.client.view.html', '');

          $state.go('media.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('media/');
          $rootScope.$digest();

          expect($location.path()).toBe('/media');
          expect($state.current.templateUrl).toBe('/modules/media/client/views/list-media.client.view.html');
        }));
      });
    });
  });
}());
