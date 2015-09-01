var dash = angular.module('DashCtrl', ['UsersSrvc']);

dash.controller("DashController", ['Users', '$state', function(Users, $state){

  var dashCtrl = this;
  dashCtrl.users = {};

  Users.getUsers().success(function(response){
    dashCtrl.users = response.users;
  });

}]);