var authService = angular.module('AuthSrvc',[]);

authService.factory('Auth', function($http) {

  var authService = {};

  authService.register = function(credentials) {
    var response = $http({
      method:'post',
      url:'api/register',
      data: credentials,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    return response;
  };

  authService.login = function(credentials) {
    var response = $http({
      method:'post',
      url:'api/auth',
      data: credentials,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    return response;
  };

  return authService;

});
