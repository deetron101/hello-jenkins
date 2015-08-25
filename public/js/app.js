var app = angular.module("memedApp", ['ui.router','AuthCtrl','AuthSrvc','DashCtrl','UsersSrvc']);

app.config( function($stateProvider, $urlRouterProvider, $locationProvider) {

  // Redirect to the auth state if any other states
  // are requested other than users
  $urlRouterProvider.otherwise('/auth');

  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'js/templates/register.html',
      controller: 'AuthController as authCtrl'
    })
    .state('auth', {
      url: '/auth',
      templateUrl: 'js/templates/login.html',
      controller: 'AuthController as authCtrl'
    })
    .state('dash', {
      url: '/dashboard',
      templateUrl: 'js/templates/dashboard.html',
      controller: 'DashController as dashCtrl'
    });

  // use the HTML5 History API
  $locationProvider.html5Mode(true);

});

app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (localStorage.getItem('token')) {
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {

  $httpProvider.defaults.transformRequest = function(data){
    if (data === undefined) {
        return data;
    }
    return $.param(data);
  }

  $httpProvider.interceptors.push('authInterceptor');
});




