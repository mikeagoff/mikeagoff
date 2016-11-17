(function() {
  	'use strict';

	angular.module('myApp').controller('mainCtrl', function ($scope) {
        $scope.startDate = new Date();
        $scope.isOpen = false;

        $scope.showPicker = function(){
        	$scope.isOpen = true;
        }
    });

})();