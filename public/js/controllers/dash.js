var dash = angular.module('DashCtrl', []);

dash.controller("DashController", ['Users', '$state', function(Users, $state){

  var dashCtrl = this;
  dashCtrl.me = {};
  dashCtrl.users = {};

  Users.getMe().success(function(response){
    dashCtrl.me = response.user;
  });

  Users.getUsers().success(function(response){
    dashCtrl.users = response.users;
  });

}]);