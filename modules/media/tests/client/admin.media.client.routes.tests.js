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
          mainstate = $state.get('admin.media');
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
          liststate = $state.get('admin.media.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/media/client/views/admin/list-media.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MediaAdminController,
          mockMedia;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.media.create');
          $templateCache.put('/modules/media/client/views/admin/form-media.client.view.html', '');

          // Create mock media
          mockMedia = new MediaService();

          // Initialize Controller
          MediaAdminController = $controller('MediaAdminController as vm', {
            $scope: $scope,
            mediaResolve: mockMedia
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mediaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/media/create');
        }));

        it('should attach an media to the controller scope', function () {
          expect($scope.vm.media._id).toBe(mockMedia._id);
          expect($scope.vm.media._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/media/client/views/admin/form-media.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MediaAdminController,
          mockMedia;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.media.edit');
          $templateCache.put('/modules/media/client/views/admin/form-media.client.view.html', '');

          // Create mock media
          mockMedia = new MediaService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Media about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          MediaAdminController = $controller('MediaAdminController as vm', {
            $scope: $scope,
            mediaResolve: mockMedia
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mediaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mediaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mediaId: 1
          })).toEqual('/admin/media/1/edit');
        }));

        it('should attach an media to the controller scope', function () {
          expect($scope.vm.media._id).toBe(mockMedia._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/media/client/views/admin/form-media.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
