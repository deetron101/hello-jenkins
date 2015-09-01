var configs = angular.module('Configs', []);

configs.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

configs.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  moderator: 'moderator',
  creator: 'creator'
});