(function () {

  'use strict';

  var inboxControllers = angular.module('inboxControllers');

  inboxControllers.controller('ContactsContentCtrl', 
    ['$scope', '$stateParams',
    function ($scope, $stateParams) {

      $scope.selectContact($stateParams.id);

      $scope.$on('ContactUpdated', function(e, contact) {
        if (!contact) {
          $scope.select();
        } else if(contact._deleted &&
            $scope.selected &&
            $scope.selected._id === contact._id) {
          $scope.setSelected();
        } else if ($scope.selected && $scope.selected._id === contact._id) {
          contact.children = $scope.selected.children;
          contact.contactFor = $scope.selected.contactFor;
          $scope.setSelected(contact);
        }
      });

    }
  ]);

}());
