(function() {
  	'use strict';


  	var app = angular.module('app', ['ngRoute']);

    app.directive("datetimePicker", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {}
            , templateUrl : "/directives/datetimePicker.html"
            , controller: ['$scope', '$element', '$sce', function ($scope, $element, $sce) {

                $scope.currentDate = new Date();

                var getMonth = function(date){
                    var month = new Date(date),
                    locale = "en-us",
                    month = month.toLocaleString(locale, { month: "short" })
                    return month;
                }

                var getYear = function(date){
                    return new Date(date).getFullYear();
                }
                
                $scope.currentMonth = getMonth($scope.currentDate);
                $scope.currentYear = getYear($scope.currentDate);

                $scope.minusMonth = function(){
                    var m = new Date($scope.currentDate);
                    var monthBeforeMove = m.getMonth();
                    $scope.currentDate = m.setMonth(m.getMonth() - 1);

                    $scope.currentMonth = getMonth(new Date($scope.currentDate));
                    if(monthBeforeMove == 0){
                        $scope.currentYear = getYear(new Date($scope.currentDate));
                    }

                }

                $scope.minusYear = function(){
                    var d = new Date($scope.currentDate);
                    var yearBeforeMove = d.getFullYear();
                    $scope.currentDate = d.setFullYear(d.getFullYear() - 1);

                    $scope.currentYear = getYear(new Date($scope.currentDate));
                }

            }]
            
        }
    }]);


})();