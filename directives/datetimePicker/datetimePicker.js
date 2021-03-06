(function() {
  	'use strict';


  	var app = angular.module('myApp');

    app.directive("datetimePicker", [function(){
        return {

            restrict: 'E'
            , replace: true
            , scope: {
                date:'=', 
                range:'=?',
                isOpen: '=?'
            }
            ,link: function (scope, element, attrs) {
            scope.$watch(attrs.date, function (v) {
                
            });
        }
            , templateUrl : "/directives/datetimePicker/datetimePicker.html"
            , controller: ['$scope', '$element', '$sce', function ($scope, $element, $sce) {


                $scope.currentDate = new Date(Date.now());
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
                        millisecond: '000',
                        selected: false
                    },
                    end: {
                        day: '',
                        month: '',
                        year: '',
                        hour: '00',
                        minute: '00',
                        second: '00',
                        millisecond: '000',
                        selected: false
                    }
                }
                if($scope.date){
                    if($scope.date.start && $scope.date.start != '' && $scope.date.end && $scope.date.end != ''){
                        var startDate = new Date($scope.date.start);
                        var endDate = new Date($scope.date.end);
                        $scope.model.start = {
                            day: startDate.getDate(),
                            month: startDate.getMonth(),
                            year: startDate.getFullYear(),
                            hour: startDate.getHours(),
                            minute: startDate.getMinutes(),
                            second: startDate.getSeconds(),
                            millisecond: startDate.getMilliseconds(),
                            selected: true
                        }
                        $scope.model.end = {
                            day: endDate.getDate(),
                            month: endDate.getMonth(),
                            year: endDate.getFullYear(),
                            hour: endDate.getHours(),
                            minute: endDate.getMinutes(),
                            second: endDate.getSeconds(),
                            millisecond: endDate.getMilliseconds(),
                            selected: true
                        }
                        
                    
                    }else{
                        $scope.date = {
                            start: {
                                combined:''
                            },
                            end: {
                                combined:''
                            }
                        }
                    }
                }else{
                     $scope.date = {
                            start: {
                                combined:''
                            },
                            end: {
                                combined:''
                            }
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

                $scope.increaseTime = function(timePart, isStart){
                    if(isStart){
                        if($scope.model.start.day == ''){
                            $scope.selectDay({ year: new Date($scope.currentDate).getFullYear(), month: $scope.currentDate.getMonth(), day: $scope.currentDate.getDate() })
                        }
                        switch(timePart){
                            case 'h':
                            $scope.model.start.hour++;
                            if($scope.model.start.hour == 24){
                                $scope.model.start.hour = 0;
                            }
                            if($scope.model.start.hour < 10){
                                $scope.model.start.hour = '0' + $scope.model.start.hour;
                            }
                            break;

                            case 'm':
                            $scope.model.start.minute++;
                            if($scope.model.start.minute == 60){
                                $scope.model.start.minute = 0;
                            }
                            if($scope.model.start.minute < 10){
                                $scope.model.start.minute = '0' + $scope.model.start.minute;
                            }
                            break;   

                            case 's':
                            $scope.model.start.second++;
                            if($scope.model.start.second == 60){
                                $scope.model.start.second = 0;
                            }
                            if($scope.model.start.second < 10){
                                $scope.model.start.second = '0' + $scope.model.start.second;
                            }
                            break;  

                            case 'ms':
                            $scope.model.start.millisecond++;
                            if($scope.model.start.millisecond == 1000){
                                $scope.model.start.millisecond = 0;
                            }
                            if($scope.model.start.millisecond < 100 && $scope.model.start.millisecond > 9){
                                $scope.model.start.millisecond = '0' + $scope.model.start.millisecond;
                            }
                            if($scope.model.start.millisecond < 10){
                                $scope.model.start.millisecond = '00' + $scope.model.start.millisecond;
                            }
                            break;                            
                        }
                    }else{
                        if($scope.model.end.day == ''){
                            $scope.selectDay({ year: new Date($scope.currentDate).getFullYear(), month: $scope.currentDate.getMonth(), day: $scope.currentDate.getDate() })
                        }

                        switch(timePart){
                            case 'h':
                            $scope.model.end.hour++;
                            if($scope.model.end.hour == 24){
                                $scope.model.end.hour = 0;
                            }
                            if($scope.model.end.hour < 10){
                                $scope.model.end.hour = '0' + $scope.model.end.hour;
                            }
                            break;

                            case 'm':
                            $scope.model.end.minute++;
                            if($scope.model.end.minute == 60){
                                $scope.model.end.minute = 0;
                            }
                            if($scope.model.end.minute < 10){
                                $scope.model.end.minute = '0' + $scope.model.end.minute;
                            }
                            break;   

                            case 's':
                            $scope.model.end.second++;
                            if($scope.model.end.second == 60){
                                $scope.model.end.second = 0;
                            }
                            if($scope.model.end.second < 10){
                                $scope.model.end.second = '0' + $scope.model.end.second;
                            }
                            break;  

                            case 'ms':
                            $scope.model.end.millisecond++;
                            if($scope.model.end.millisecond == 1000){
                                $scope.model.end.millisecond = 0;
                            }
                            if($scope.model.end.millisecond < 100 && $scope.model.end.millisecond > 9){
                                $scope.model.end.millisecond = '0' + $scope.model.end.millisecond;
                            }
                            if($scope.model.end.millisecond < 10){
                                $scope.model.end.millisecond = '00' + $scope.model.end.millisecond;
                            }
                            break;                            
                        }
                    }
                    $scope.updateAndFormatSelection();
                }

                $scope.decreaseTime = function(timePart, isStart){
                    if(isStart){
                        if($scope.model.end.day == ''){
                            $scope.selectDay({ year: new Date($scope.currentDate).getFullYear(), month: $scope.currentDate.getMonth(), day: $scope.currentDate.getDate() })
                        }
                        switch(timePart){
                            case 'h':
                            $scope.model.start.hour--;
                            if($scope.model.start.hour == -1){
                                $scope.model.start.hour = 23;
                            }
                            if($scope.model.start.hour < 10){
                                $scope.model.start.hour = '0' + $scope.model.start.hour;
                            }
                            break;

                            case 'm':
                            $scope.model.start.minute--;
                            if($scope.model.start.minute == -1){
                                $scope.model.start.minute = 59;
                            }
                            if($scope.model.start.minute < 10){
                                $scope.model.start.minute = '0' + $scope.model.start.minute;
                            }
                            break;   

                            case 's':
                            $scope.model.start.second--;
                            if($scope.model.start.second == -1){
                                $scope.model.start.second = 59;
                            }
                            if($scope.model.start.second < 10){
                                $scope.model.start.second = '0' + $scope.model.start.second;
                            }
                            break;  

                            case 'ms':
                            $scope.model.start.millisecond--;
                            if($scope.model.start.millisecond == -1){
                                $scope.model.start.millisecond = 999;
                            }
                            if($scope.model.start.millisecond < 100 && $scope.model.start.millisecond > 9){
                                $scope.model.start.millisecond = '0' + $scope.model.start.millisecond;
                            }
                            if($scope.model.start.millisecond < 10){
                                $scope.model.start.millisecond = '00' + $scope.model.start.millisecond;
                            }
                            break;                            
                        }
                    }else{
                        if($scope.model.end.day == ''){
                            $scope.selectDay({ year: new Date($scope.currentDate).getFullYear(), month: $scope.currentDate.getMonth(), day: $scope.currentDate.getDate() })
                        }

                        switch(timePart){
                            case 'h':
                            $scope.model.end.hour--;
                            if($scope.model.end.hour == -1){
                                $scope.model.end.hour = 23;
                            }
                            if($scope.model.end.hour < 10){
                                $scope.model.end.hour = '0' + $scope.model.end.hour;
                            }
                            break;

                            case 'm':
                            $scope.model.end.minute--;
                            if($scope.model.end.minute == -1){
                                $scope.model.end.minute = 59;
                            }
                            if($scope.model.end.minute < 10){
                                $scope.model.end.minute = '0' + $scope.model.end.minute;
                            }
                            break;   

                            case 's':
                            $scope.model.end.second--;
                            if($scope.model.end.second == -1){
                                $scope.model.end.second = 59;
                            }
                            if($scope.model.end.second < 10){
                                $scope.model.end.second = '0' + $scope.model.end.second;
                            }
                            break;  

                            case 'ms':
                            $scope.model.end.millisecond--;
                            if($scope.model.end.millisecond == -1){
                                $scope.model.end.millisecond = 999;
                            }
                            if($scope.model.end.millisecond < 100 && $scope.model.end.millisecond > 9){
                                $scope.model.end.millisecond = '0' + $scope.model.end.millisecond;
                            }
                            if($scope.model.end.millisecond < 10){
                                $scope.model.end.millisecond = '00' + $scope.model.end.millisecond;
                            }
                            break;                            
                        }
                    }
                    $scope.updateAndFormatSelection();
                }

                $scope.isStart = function(date){
                    if(date.year == $scope.model.start.year && date.month == $scope.model.start.month && date.day == $scope.model.start.day){
                        return true;
                    } 
                    return false;
                }


                $scope.isEnd = function(date){
                    if(date.year == $scope.model.end.year && date.month == $scope.model.end.month && date.day == $scope.model.end.day){
                        return true;
                    }
                    return false;
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

                        var thisDayJson = (new Date(($scope.currentDate).getFullYear(), currentMonth, i));
                        var currentDayJson = (new Date());
                        currentDayJson.setHours(0);
                        currentDayJson.setMinutes(0);
                        currentDayJson.setSeconds(0);
                        currentDayJson.setMilliseconds(0);

                        var date = {
                            type: "current",
                            month: currentMonth + 1,
                            day: i,
                            year: new Date($scope.currentDate).getFullYear(),
                            isSelected: false,
                            isToday: (thisDayJson.toJSON() == currentDayJson.toJSON())? true : false
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

                    // second calendar display
                    
                    firstDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                    lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                    previousMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    nextMonth = new Date(d.getFullYear(), d.getMonth() + 2, 1);
                    currentMonth = d.getMonth() + 1;
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

                        var thisDayJson = (new Date(($scope.currentDate).getFullYear(), currentMonth, i));
                        var currentDayJson = (new Date());
                        currentDayJson.setHours(0);
                        currentDayJson.setMinutes(0);
                        currentDayJson.setSeconds(0);
                        currentDayJson.setMilliseconds(0);
                        
                        var date = {
                            type: "current",
                            month: currentMonth + 1,
                            day: i,
                            year: new Date($scope.currentDate).getFullYear(),
                            isSelected: false,
                            isToday: (thisDayJson.toJSON() == currentDayJson.toJSON())? true : false
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

                $scope.isDayInRange = function(day){
                    if($scope.range 
                        && $scope.model.start.day != '' 
                        && $scope.model.end.day != '' 
                        && (new Date($scope.model.start.year, $scope.model.start.month - 1, $scope.model.start.day) < new Date(day.year, day.month - 1, day.day))
                        && (new Date($scope.model.end.year, $scope.model.end.month - 1, $scope.model.end.day) > new Date(day.year, day.month - 1, day.day))){
                        return true;
                    }
                    return false;
                }

                $scope.selectDay = function(day){
                    if(day.type == 'previous'){
                        $scope.minusMonth();
                    }
                    if(day.type == 'next'){
                        $scope.plusMonth();
                    }
                    if($scope.range){
                        // start and end dates needed
                        if($scope.model.start.day != '' && $scope.model.end.day == ''){

                            for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                                $scope.firstMonthDaysArrary[i].inRange = false;
                            }
                            for(var i = 0; i < $scope.secondMonthDaysArrary.length; i++){
                                $scope.secondMonthDaysArrary[i].inRange = false;
                            }
                            day.isSelected = true;
                            $scope.model.end.year = day.year;
                            $scope.model.end.month = day.month;
                            $scope.model.end.day = day.day;
                            $scope.model.end.selected = true;
                            $scope.currentDate = new Date(day.year, day.month - 1, day.day);

                            if(new Date($scope.model.start.year, $scope.model.start.month - 1, $scope.model.start.day) > $scope.currentDate){
                                $scope.model.end.year = $scope.model.start.year;
                                $scope.model.end.month = $scope.model.start.month;
                                $scope.model.end.day = $scope.model.start.day;
                                $scope.model.start.year = day.year;
                                $scope.model.start.month = day.month;
                                $scope.model.start.day = day.day;

                            }

                            // $scope.currentMonth = getMonth($scope.currentDate, true);
                            // $scope.currentYear = getYear($scope.currentDate, true);

                            for(var i = 0; i < $scope.secondMonthDaysArrary.length; i++){
                                if($scope.secondMonthDaysArrary[i].month == $scope.model.end.month && $scope.secondMonthDaysArrary[i].year == $scope.model.end.year && $scope.secondMonthDaysArrary[i].day == $scope.model.end.day){
                                    $scope.secondMonthDaysArrary[i].isSelected = true;
                                }
                                if($scope.secondMonthDaysArrary[i].month == $scope.model.start.month && $scope.secondMonthDaysArrary[i].year == $scope.model.start.year && $scope.secondMonthDaysArrary[i].day == $scope.model.start.day){
                                    $scope.secondMonthDaysArrary[i].isSelected = true;
                                }
                                if($scope.isDayInRange($scope.secondMonthDaysArrary[i])){
                                    $scope.secondMonthDaysArrary[i].inRange = true;
                                }
                            }

                            for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                                if($scope.isDayInRange($scope.firstMonthDaysArrary[i])){
                                    $scope.firstMonthDaysArrary[i].inRange = true;
                                }
                            }

                        }else{

                            for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                                $scope.firstMonthDaysArrary[i].isSelected = false;
                                $scope.firstMonthDaysArrary[i].inRange = false;
                            }
                            for(var i = 0; i < $scope.secondMonthDaysArrary.length; i++){
                                $scope.secondMonthDaysArrary[i].isSelected = false;
                                $scope.secondMonthDaysArrary[i].inRange = false;
                            }
                            day.isSelected = true;

                            $scope.model.start.year = day.year;
                            $scope.model.start.month = day.month;
                            $scope.model.start.day = day.day;
                            $scope.model.start.selected = true;
                            $scope.model.end.year = '';
                            $scope.model.end.month = '';
                            $scope.model.end.day = '';
                            $scope.model.end.selected = false;

                            for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                                if($scope.firstMonthDaysArrary[i].month == $scope.model.start.month && $scope.firstMonthDaysArrary[i].year == $scope.model.start.year && $scope.firstMonthDaysArrary[i].day == $scope.model.start.day){
                                    $scope.firstMonthDaysArrary[i].isSelected = true;
                                }
                                if($scope.isDayInRange($scope.firstMonthDaysArrary[i])){
                                    $scope.firstMonthDaysArrary[i].inRange = true;
                                }
                            }

                        }
                    }else{
                        $scope.model.start.year = day.year;
                        $scope.model.start.month = day.month;
                        $scope.model.start.day = day.day;
                        $scope.model.start.selected = true;
                        $scope.model.end.year = '';
                        $scope.model.end.month = '';
                        $scope.model.end.day = '';
                        $scope.model.end.selected = false;
                        $scope.currentDate = new Date(day.year, day.month - 1, day.day);
                        $scope.currentMonth = getMonth($scope.currentDate, true);
                        $scope.currentYear = getYear($scope.currentDate, true);

                        for(var i = 0; i < $scope.firstMonthDaysArrary.length; i++){
                            if($scope.firstMonthDaysArrary[i].month == $scope.model.start.month && $scope.firstMonthDaysArrary[i].year == $scope.model.start.year && $scope.firstMonthDaysArrary[i].day == $scope.model.start.day){
                                $scope.firstMonthDaysArrary[i].isSelected = true;
                            }
                        }
                    }
                    $scope.updateAndFormatSelection();
                }

                $scope.updateAndFormatSelection = function(){
                    $scope.date.start.combined = moment(new Date($scope.model.start.year, $scope.model.start.month - 1, $scope.model.start.day, $scope.model.start.hour, $scope.model.start.minute, $scope.model.start.second, $scope.model.start.millisecond)).format('YYYY-MM-DD HH:mm:ss.SSS');
                    if($scope.model.end.day != '')
                    $scope.date.end.combined = moment(new Date($scope.model.end.year, $scope.model.end.month - 1, $scope.model.end.day, $scope.model.end.hour, $scope.model.end.minute, $scope.model.end.second, $scope.model.end.millisecond)).format('YYYY-MM-DD HH:mm:ss.SSS');
                }

                $scope.generateDays();  
                
                
            }]
            
        }
    }]);


})();