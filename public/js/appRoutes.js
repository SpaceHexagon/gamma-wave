angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// media player interface
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/library', {
			templateUrl: 'views/library.html',
			controller: 'MediaController'
		})

	$locationProvider.html5Mode(true);

}]);