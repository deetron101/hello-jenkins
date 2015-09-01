var common = angular.module('CommonCtrl',[]);

common.controller("CommonController", ['$scope', 'USER_ROLES', 'Auth', 'Users', function($scope, USER_ROLES, Auth, Users){

  $scope.currentUser = {};

  Users.getMe().then(function(res) {
    $scope.currentUser = res.data.user;
  }, function(res){
    $scope.currentUser = {};
    $state.transitionTo('login');
  });

}]);
