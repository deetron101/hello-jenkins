var users = angular.module('UsersSrvc',[]);

users.factory('Users', function($http) {

  var users = {};
  var me = {};

  users.getUsers = function() {
    var response = $http({
      method:'get',
      url:'api/users/all'
    });
    return response;
  };

  users.getMe = function() {
    var response = $http({
      method:'get',
      url:'api/users/me'
    });
    return response;
  }

  return users;

});
