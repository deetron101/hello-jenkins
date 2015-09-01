var authService = angular.module('AuthSrvc',[]);

authService.factory('Auth', function($http, USER_ROLES) {

  var authService = {};

  authService.register = function(credentials) {
    var response = $http({
      method:'post',
      url:'api/auth/register',
      data: credentials,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    return response;
  };

  authService.login = function(credentials) {
    return $http({
      method:'post',
      url:'api/auth/login',
      data: credentials,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      // First, set a the token as a cookie
      var tokenExpiresTime = res.data.user.exp;
      var date = new Date(tokenExpiresTime*1000).toUTCString();
      document.cookie='token='+res.data.token+'; expires='+date+';';
      var role = res.data.user.role || USER_ROLES.creator;
      document.cookie='userrole='+role+'; expires='+date+';';
      return res.data.user;
    });
  };

  authService.isAuthorized = function (authorizedRoles, userRole) {
    return authorizedRoles.indexOf(userRole) !== -1;
  };

  return authService;

});
