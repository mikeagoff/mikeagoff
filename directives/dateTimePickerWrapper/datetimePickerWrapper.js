(function() {
  	'use strict';


  	var app = angular.module('myApp');

    app.directive("datetimePickerWrapper", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {
                range:'='
            }
            , templateUrl : "/directives/datetimePickerWrapper/datetimePickerWrapper.html"
            , controller: ['$scope', '$element', '$sce', function ($scope, $element, $sce) {

                

                 

            }]
            
        }
    }]);


})();