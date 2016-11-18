(function() {
  	'use strict';


  	var app = angular.module('myApp');

    app.directive("datetimePicker", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {
                date:'=?', 
                range:'=?',
                isOpen: '=?'
            }
            , templateUrl : "/directives/datetimePicker/datetimePicker.html"
            , controller: ['$scope', '$element', '$sce', function ($scope, $element, $sce) {

                $scope.currentDate = new Date(Date.now());

                if($scope.date != null && $scope.date != ''){
                    $scope.currentDate = $scope.date
                }

                $scope.firstMonthDaysArrary = [];
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

                // find the location of the input and use it to position the picker
                var inputLocation = {
                    left: angular.element('.datetime-picker-input').prop('offsetLeft'),
                    top: angular.element('.datetime-picker-input').prop('offsetTop')
                }
                angular.element('.ccs-datetime-picker').css({ 'top': inputLocation.top + 35 + 'px', 'left': inputLocation.left + 'px'})

                var getMonth = function(date, isCurrent){
                    var date = new Date(date);
                    if(!isCurrent){
                        var thisMonth = date.getMonth();
                        if(thisMonth == 11){
                            date = new Date(date.setMonth(0));
                            date = new Date(date.setFullYear(new Date(date.getFullYear() + 1)));
                        }else{
                            date = new Date(date.setMonth(date.getMonth() + 1));
                        }
                        
                    }
                     
                    return date.toLocaleString('en-us', { month: "short" });
                }

                var getYear = function(date, isCurrent){
                    var date = new Date(date);
                    if(!isCurrent){
                        var thisMonth = date.getMonth();

                        if(thisMonth == 11){
                            date = new Date(date.setMonth(0));
                            date = new Date(date.setFullYear(new Date(date.getFullYear() + 1)));
                        }else{
                            date = new Date(date.setMonth(thisMonth + 1));
                        }
                        
                    }
                    return date.getFullYear();
                }
                
                $scope.currentMonth = getMonth($scope.currentDate, true);
                $scope.currentYear = getYear($scope.currentDate, true);
                $scope.nextMonth = getMonth($scope.currentDate, false);
                $scope.nextYear = getYear($scope.currentDate, false);

                $scope.minusMonth = function(){
                    var m = new Date($scope.currentDate);
                    var monthBeforeMove = m.getMonth();
                    $scope.currentDate = new Date(m.setMonth(m.getMonth() - 1));

                    $scope.currentMonth = getMonth(new Date($scope.currentDate), true);
                    if(monthBeforeMove == 0, true){
                        $scope.currentYear = getYear(new Date($scope.currentDate), true);
                    }

                    $scope.nextMonth = getMonth(new Date($scope.currentDate), false);
                    if(monthBeforeMove == 0, true){
                        $scope.nextYear = getYear(new Date($scope.currentDate), false);
                    }
                    $scope.generateDays();

                }

                $scope.minusYear = function(){
                    var d = new Date($scope.currentDate);
                    var yearBeforeMove = d.getFullYear();
                    $scope.currentDate = new Date(d.setFullYear(d.getFullYear() - 1));

                    $scope.currentYear = getYear(new Date($scope.currentDate), true);
                    $scope.nextYear = getYear(new Date($scope.currentDate), false);
                    $scope.generateDays();
                }

                $scope.plusMonth = function(){
                    var m = new Date($scope.currentDate);
                    var monthBeforeMove = m.getMonth();
                    $scope.currentDate = new Date(m.setMonth(m.getMonth() + 1));

                    $scope.currentMonth = getMonth(new Date($scope.currentDate), true);
                    if(monthBeforeMove == 11){
                        $scope.currentYear = getYear(new Date($scope.currentDate), true);
                    }

                    $scope.nextMonth = getMonth(new Date($scope.currentDate), false);
                    if(monthBeforeMove == 10){
                        $scope.nextYear = getYear(new Date($scope.currentDate), false);
                    }
                    $scope.generateDays();

                }

                $scope.plusYear = function(){
                    var d = new Date($scope.currentDate);
                    var yearBeforeMove = d.getFullYear();
                    $scope.currentDate = new Date(d.setFullYear(d.getFullYear() + 1));

                    $scope.currentYear = getYear(new Date($scope.currentDate), true);
                    $scope.nextYear = getYear(new Date($scope.currentDate), false);
                    $scope.generateDays();
                }

                $scope.generateDays = function(){
                    $scope.firstMonthDaysArrary = [];
                    $scope.secondMonthDaysArrary = [];
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

                        $scope.firstMonthDaysArrary.push(date);
                    }

                    // add current month to display
                    for(var i = 1; i < daysInMonth + 1; i++){

                        var date = {
                            type: "current",
                            month: currentMonth + 1,
                            day: i,
                            year: new Date($scope.currentDate).getFullYear(),
                            isSelected: false
                        }

                        $scope.firstMonthDaysArrary.push(date);
                    }

                    // add next month to display
                    var mod = $scope.firstMonthDaysArrary.length % 7;
                    var modDays = 8 - mod;
                    
                    if(Math.floor($scope.firstMonthDaysArrary.length / 7) < 6){
                        modDays += 7 * (5 - Math.floor($scope.firstMonthDaysArrary.length / 7)) ;
                    }

                    for(var i = 1; i < modDays; i++){
                        var date = {
                            type: "next",
                            month: nextMonth.getMonth() + 1,
                            day: i,
                            year: nextMonth.getFullYear(),
                            isSelected: false
                        }

                        $scope.firstMonthDaysArrary.push(date);
                    }

                    if($scope.model.start.day != ''){
                        var date = (new Date($scope.currentDate.setDate($scope.model.start.day))).toJSON();
                        var newDate = (new Date($scope.model.start.year, $scope.model.start.month - 1, $scope.model.start.day)).toJSON();
                        if (date == newDate){
                            $scope.selectDay({year: $scope.model.start.year, month: $scope.model.start.month, day: $scope.model.start.day})
                        }
                        if($scope.model.end.day != ''){
                            var date = (new Date($scope.currentDate.setDate($scope.model.end.day))).toJSON();
                            var newDate = (new Date($scope.model.end.year, $scope.model.end.month - 1, $scope.model.end.day)).toJSON();
                            if (date == newDate){
                                $scope.selectDay({year: $scope.model.end.year, month: $scope.model.end.month, day: $scope.model.end.day})
                            }
                        } 
                    } 

                    
                    firstDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                    lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                    previousMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    nextMonth = new Date(d.getFullYear(), d.getMonth() + 2, 1);
                    currentMonth = d.getMonth();
                    if($scope.currentMonth == 0){
                        previousMonth = new Date(d.getFullYear() - 1, d.getMonth() + 1, 0);
                    }

                    dayNumberFirstDay = firstDayOfMonth.getDay();
                    daysInMonth = lastDayOfMonth.getDate();

                    // add previous month to display
                    lastDayOfPreviousMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
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

                        $scope.secondMonthDaysArrary.push(date);
                    }

                    // add current month to display
                    for(var i = 1; i < daysInMonth + 1; i++){

                        var date = {
                            type: "current",
                            month: currentMonth + 1,
                            day: i,
                            year: new Date($scope.currentDate).getFullYear(),
                            isSelected: false
                        }

                        $scope.secondMonthDaysArrary.push(date);
                    }

                    // add next month to display
                    var mod = $scope.secondMonthDaysArrary.length % 7;
                    var modDays = 8 - mod;
                    
                    if(Math.floor($scope.secondMonthDaysArrary.length / 7) < 6){
                        modDays += 7 * (5 - Math.floor($scope.secondMonthDaysArrary.length / 7)) ;
                    }

                    for(var i = 1; i < modDays; i++){
                        var date = {
                            type: "next",
                            month: nextMonth.getMonth() + 1,
                            day: i,
                            year: nextMonth.getFullYear(),
                            isSelected: false
                        }

                        $scope.secondMonthDaysArrary.push(date);
                    }


                }

                $scope.selectDay = function(day, isFirst){

                    for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                        $scope.firstMonthDaysArrary[i].isSelected = false;
                    }
                    day.isSelected = true;

                    if($scope.range && $scope.model.start.day != ''){

                        $scope.model.end.year = day.year;
                        $scope.model.end.month = day.month;
                        $scope.model.end.day = day.day;
                        $scope.currentDate = new Date(day.year, day.month -1, day.day)
                        $scope.date = $scope.currentDate;
                        $scope.currentMonth = getMonth($scope.currentDate, true);
                        $scope.currentYear = getYear($scope.currentDate, true);

                        for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                            if($scope.firstMonthDaysArrary[i].month == $scope.model.end.month && $scope.firstMonthDaysArrary[i].year == $scope.model.end.year && $scope.firstMonthDaysArrary[i].day == $scope.model.end.day){
                                $scope.firstMonthDaysArrary[i].isSelected = true;
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
                        $scope.currentMonth = getMonth($scope.currentDate, true);
                        $scope.currentYear = getYear($scope.currentDate, true);

                        for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                            if($scope.firstMonthDaysArrary[i].month == $scope.model.start.month && $scope.firstMonthDaysArrary[i].year == $scope.model.start.year && $scope.firstMonthDaysArrary[i].day == $scope.model.start.day){
                                $scope.firstMonthDaysArrary[i].isSelected = true;
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