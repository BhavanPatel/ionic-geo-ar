appCtrl.controller('aboutCtrl', ['$scope', '$state','$stateParams',
  function($scope, $state, $stateParams) {
    $scope.goWelcome = function() {
      $state.go('welcome');
    };
  }
]);
