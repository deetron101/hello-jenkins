var auth = angular.module('AuthCtrl', []);

auth.controller("AuthController", ['Auth', '$state', function(Auth, $state){

  var authCtrl = this;

  authCtrl.loginSubmit = function(data){
    Auth.login(data).then(function(res) {
      localStorage.setItem('token', res.data.token)
      // If login is successful, redirect to the users state
      $state.go('dash', {});
    });
    $state.go('register', {});
  }

  authCtrl.registerSubmit = function(data){
    Auth.register(data).then(function(res) {
      $state.go('auth', {});
    });
  }

}]);