var auth = angular.module('AuthCtrl', []);

auth.controller("AuthController", ['$rootScope', '$scope', 'AUTH_EVENTS', 'Auth', '$state', function($rootScope, $scope, AUTH_EVENTS, Auth, $state){

  var authCtrl = this;

  authCtrl.data = {
    email: '',
    password: '',
    cpassword: ''
  };

  authCtrl.message = '';

  authCtrl.loginSubmit = function(data){
    Auth.login(data)
    .then(function(user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      // If login is successful, redirect to the dashboard
      $state.transitionTo('dash');
    }, function(res){
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $state.transitionTo('register');
    });
  }

  authCtrl.registerSubmit = function(data){
    Auth.register(data).then(function(res) {
      $state.transitionTo('login');
    }, function(res){
      authCtrl.message = res.data.message;
      authCtrl.data = {
        email: '',
        password: '',
        cpassword: ''
      };
    });
  }

}]);