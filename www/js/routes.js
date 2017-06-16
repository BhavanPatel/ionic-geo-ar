angular.module('app.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'app/welcome/welcome.html',
        controller: 'welcomeCtrl'
      })
      .state('tabsController', {
        url: '/tab',
        templateUrl: 'app/tabs/tabs.html',
        abstract: true
      })
      .state('tabsController.home', {
        url: '/home',
        views: {
          'tab1': {
            templateUrl: 'app/home/home.html',
            controller: 'homeCtrl'
          }
        }
      })
      .state('tabsController.about', {
        url: '/about',
        views: {
          'tab2': {
            templateUrl: 'app/about/about.html',
            controller: 'aboutCtrl'
          }
        }
      });
    $urlRouterProvider.otherwise('/welcome');
  });
