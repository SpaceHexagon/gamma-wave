angular.module('MediaService', []).factory('Media', ['$http', function($http) {

    return {
        // call to get all media
        get : function() {
            return $http.get('/api/media');
        },

        // call to POST and create new media
        create : function(mediaData) {
            return $http.post('/api/media', mediaData);
        },

        // call to DELETE media
        delete : function(id) {
            return $http.delete('/api/media/' + id);
        }
    }     

}]);