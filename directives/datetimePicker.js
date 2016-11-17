(function() {
  	'use strict';


  	var app = angular.module('myApp');

    app.directive("datetimePicker", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {
                date:'=?', 
                range:'=',
                isOpen: '=?'
            }
            , templateUrl : "/directives/datetimePicker.html"
            , controller: ['$scope', '$element', '$sce', function ($scope, $element, $sce) {

                $scope.currentDate = new Date(Date.now());

                if($scope.date != null && $scope.date != ''){
                    $scope.currentDate = $scope.date
                }

                $scope.currentMonthDaysArrary = [];
                $scope.nextMonthDaysArrary = [];

                $scope.model = {
                    start: {
                        day: '',
                        month: '',
                        year: '',
                        hour: '00',
                        minute: '00',
                        second: '00',
                        millisecond: '000'
                    },
                    end: {
                        day: '',
                        month: '',
                        year: '',
                        hour: '00',
                        minute: '00',
                        second: '00',
                        millisecond: '000'
                    }
                }

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
                    $scope.currentDate = new Date(m.setMonth(m.getMonth() - 1));

                    $scope.currentMonth = getMonth(new Date($scope.currentDate));
                    if(monthBeforeMove == 0){
                        $scope.currentYear = getYear(new Date($scope.currentDate));
                    }
                    $scope.generateDays();

                }

                $scope.minusYear = function(){
                    var d = new Date($scope.currentDate);
                    var yearBeforeMove = d.getFullYear();
                    $scope.currentDate = new Date(d.setFullYear(d.getFullYear() - 1));

                    $scope.currentYear = getYear(new Date($scope.currentDate));
                    $scope.generateDays();
                }

                $scope.plusMonth = function(){
                    var m = new Date($scope.currentDate);
                    var monthBeforeMove = m.getMonth();
                    $scope.currentDate = new Date(m.setMonth(m.getMonth() + 1));

                    $scope.currentMonth = getMonth(new Date($scope.currentDate));
                    if(monthBeforeMove == 11){
                        $scope.currentYear = getYear(new Date($scope.currentDate));
                    }
                    $scope.generateDays();

                }

                $scope.plusYear = function(){
                    var d = new Date($scope.currentDate);
                    var yearBeforeMove = d.getFullYear();
                    $scope.currentDate = new Date(d.setFullYear(d.getFullYear() + 1));

                    $scope.currentYear = getYear(new Date($scope.currentDate));
                    $scope.generateDays();
                }

                $scope.generateDays = function(){
                    $scope.currentMonthDaysArrary = [];
                    var d = new Date($scope.currentDate);
                    var firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
                    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    var previousMonth = new Date(d.getFullYear(), d.getMonth(), 0);
                    var nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                    var currentMonth = d.getMonth();
                    if($scope.currentMonth == 0){
                        var previousMonth = new Date(d.getFullYear() - 1, d.getMonth(), 0);
                    }

                    var dayNumberFirstDay = firstDayOfMonth.getDay();
                    var daysInMonth = lastDayOfMonth.getDate();

                    // add previous month to display
                    var lastDayOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
                    var daysInPreviousMonth = lastDayOfPreviousMonth.getDate();

                    if(dayNumberFirstDay == 0){
                        dayNumberFirstDay = 7;
                    }

                    for(var i = daysInPreviousMonth - dayNumberFirstDay; i < daysInPreviousMonth; i++){
                        var date = {
                            type: "previous",
                            month: previousMonth.getMonth() + 1,
                            day: i + 1,
                            year: previousMonth.getFullYear(),
                            isSelected: false
                        }

                        $scope.currentMonthDaysArrary.push(date);
                    }

                    // add current month to display
                    for(var d = 1; d < daysInMonth + 1; d++){

                        var date = {
                            type: "current",
                            month: currentMonth + 1,
                            day: d,
                            year: new Date($scope.currentDate).getFullYear(),
                            isSelected: false
                        }

                        $scope.currentMonthDaysArrary.push(date);
                    }

                    // add next month to display
                    var mod = $scope.currentMonthDaysArrary.length % 7;
                    var modDays = 8 - mod;
                    
                    if(Math.floor($scope.currentMonthDaysArrary.length / 7) < 6){
                        modDays += 7 * (5 - Math.floor($scope.currentMonthDaysArrary.length / 7)) ;
                    }

                    for(var i = 1; i < modDays; i++){
                        var date = {
                            type: "next",
                            month: nextMonth.getMonth() + 1,
                            day: i,
                            year: nextMonth.getFullYear(),
                            isSelected: false
                        }

                        $scope.currentMonthDaysArrary.push(date);
                    }

                    if($scope.model.start.day != ''){
                        var date = (new Date($scope.currentDate.setDate($scope.model.start.day))).toJSON();
                        var newDate = (new Date($scope.model.start.year, $scope.model.start.month - 1, $scope.model.start.day)).toJSON();
                        if (date == newDate){
                            $scope.selectDay({year: $scope.model.start.year, month: $scope.model.start.month, day: $scope.model.start.day})
                        }
                    } 

                    if($scope.model.end.day != ''){
                        var date = (new Date($scope.currentDate.setDate($scope.model.end.day))).toJSON();
                        var newDate = (new Date($scope.model.end.year, $scope.model.end.month - 1, $scope.model.end.day)).toJSON();
                        if (date == newDate){
                            $scope.selectDay({year: $scope.model.end.year, month: $scope.model.end.month, day: $scope.model.end.day})
                        }
                    } 


                }

                $scope.selectDay = function(day){

                    for(var i = 0; i < $scope.currentMonthDaysArrary.length; i++){
                        $scope.currentMonthDaysArrary[i].isSelected = false;
                    }
                    day.isSelected = true;

                    if($scope.range && $scope.model.start.day != ''){

                        $scope.model.end.year = day.year;
                        $scope.model.end.month = day.month;
                        $scope.model.end.day = day.day;
                        $scope.currentDate = new Date(day.year, day.month -1, day.day)
                        $scope.date = $scope.currentDate;
                        $scope.currentMonth = getMonth($scope.currentDate);
                        $scope.currentYear = getYear($scope.currentDate);

                        for(var i = 0; i < $scope.currentMonthDaysArrary.length; i++){
                            if($scope.currentMonthDaysArrary[i].month == $scope.model.end.month && $scope.currentMonthDaysArrary[i].year == $scope.model.end.year && $scope.currentMonthDaysArrary[i].day == $scope.model.end.day){
                                $scope.currentMonthDaysArrary[i].isSelected = true;
                            }
                        }
                    }else{
                        $scope.model.start.year = day.year;
                        $scope.model.start.month = day.month;
                        $scope.model.start.day = day.day;
                        $scope.model.end.year = '';
                        $scope.model.end.month = '';
                        $scope.model.end.day = '';
                        $scope.currentDate = new Date(day.year, day.month -1, day.day)
                        $scope.date = $scope.currentDate;
                        $scope.currentMonth = getMonth($scope.currentDate);
                        $scope.currentYear = getYear($scope.currentDate);

                        for(var i = 0; i < $scope.currentMonthDaysArrary.length; i++){
                            if($scope.currentMonthDaysArrary[i].month == $scope.model.start.month && $scope.currentMonthDaysArrary[i].year == $scope.model.start.year && $scope.currentMonthDaysArrary[i].day == $scope.model.start.day){
                                $scope.currentMonthDaysArrary[i].isSelected = true;
                            }
                        }
                    }
                }

                $scope.generateDays();  
                
                // set the current date as default
                $scope.selectDay({ year: new Date($scope.currentDate).getFullYear(), month: $scope.currentDate.getMonth() + 1, day: $scope.currentDate.getDate() })

            }]
            
        }
    }]);


})();