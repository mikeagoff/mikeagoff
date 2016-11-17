(function() {
  	'use strict';


  	angular.module('myApp', [])
    .controller('mainCtrl', function ($scope) {
        $scope.startDate = new Date();
        $scope.endDate = new Date();
    });





})();