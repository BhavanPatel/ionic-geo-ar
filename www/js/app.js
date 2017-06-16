angular.module('app', [
    'ionic',
    'app.controllers',
    'app.routes',
    'app.directives',
    'app.services',
    'app.filters',
    'ngCordova'
  ])

  .config(function($ionicConfigProvider, $sceDelegateProvider) {
    $ionicConfigProvider.backButton.text('').previousTitleText(false);
  })

  .run(function($ionicPlatform, $rootScope, $cordovaNetwork, $ionicPopup) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
});
