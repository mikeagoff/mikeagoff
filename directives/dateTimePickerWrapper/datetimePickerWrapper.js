(function() {
  	'use strict';


  	var app = angular.module('myApp');

    app.directive("datetimePickerWrapper", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {
                range:'=?',
                isOpen: '=?'
            }
            , templateUrl : "/directives/datetimePickerWrapper/datetimePickerWrapper.html"
            , controller: ['$scope', '$element', '$sce', function ($scope, $element, $sce) {
                
                $scope.showPicker = function(){
                    $scope.isOpen = true; 
                };


            }],

            link: function ($scope, element, attr) {

                // automatically close popup if clicked outside of directive
                $(document).on('mouseup', function (event) {
                    var clickEventIsntDatePicker = !element.is(event.target);
                    var clickEventIsntDatePickerChild = element.has(event.target).length === 0;

                    if (clickEventIsntDatePicker && clickEventIsntDatePickerChild) {
                        
                        $scope.isOpen = false;
                        $scope.$apply();
                    }
                });
            }
                            
        }
    }]);


})();