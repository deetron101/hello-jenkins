var app = angular.module("memedApp", ['ui.router','Configs','CommonCtrl','AuthCtrl','AuthSrvc','DashCtrl','CreateCtrl']);

app.config( function($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {

  // Redirect to the auth state if any other states other than defined
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: 'js/templates/register.html',
      controller: 'AuthController as authCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'js/templates/login.html',
      controller: 'AuthController as authCtrl'
    })
    .state('logout', {
      url: '/login',
      templateUrl: 'js/templates/login.html',
      controller: 'AuthController as authCtrl'
    })
    .state('dash', {
      url: '/dashboard',
      templateUrl: 'js/templates/dashboard.html',
      controller: 'DashController as dashCtrl',
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.creator]
      }
    })
    .state('create', {
      url: '/create',
      templateUrl: 'js/templates/create.html',
      controller: 'CreateController as createCtrl',
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.creator]
      }
    });

  // use the HTML5 History API
  $locationProvider.html5Mode(true);

});

app.run( function ($rootScope, AUTH_EVENTS, Auth, $state) {

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

    // If User is not logged in
    if (!getCookie('userrole')) {
      event.preventDefault();
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      $state.transitionTo('login');
    }
    if (toState.data) {
      var authorizedRoles = toState.data.authorizedRoles;
      // User is not authorized
      if (!Auth.isAuthorized(authorizedRoles, getCookie('userrole'))) {
        event.preventDefault();
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        $state.transitionTo('dash');
      }
    }
    // If User is already logged in
    if (toState.name=="login" && getCookie('userrole')) {
      event.preventDefault();
      $state.transitionTo('dash');
    }
    if (toState.name=="logout") {
      removeCookie('userrole');
      removeCookie('token');
    }
  });

});

app.factory('authInterceptor', function ($rootScope, $q, $window, AUTH_EVENTS) {

  return {
    request: function (config) {
      config.headers = config.headers || {};
      var token = getCookie('token');
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    response: function (response) {
      return response || $q.when(response);
    },
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  }
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

function getCookie(key) {
  var key = key + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(key) == 0) return c.substring(key.length,c.length);
  }
  return "";
}

function removeCookie(key) {
  document.cookie = key+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}




