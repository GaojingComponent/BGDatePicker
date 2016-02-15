var bgDateCalendar = angular.module('bg.datePicker.calendar', ['bg.datePicker.service']);
var $ = angular.element;
bgDateCalendar.directive('bgDatePickerCalendar', ['$filter', '$parse', 'DateService', function ($filter, $parse, dateService) {
    /**
     * render calendar
     * @param  {Integer} year  year of calendar
     * @param  {Integer} month month of calendar
     * @param  {Date} date current date of calendar
     * @param  {Elemetnt} table table element to render calendar
     */
    var renderCalendar = function (year, month, date, table) {
        var now = new Date();
        var curYear = now.getFullYear();
        var curMonth = now.getMonth() + 1;
        var firstDayOfMonth = dateService.getFirstDayOfMonth(year, month);
        var maxDayOfThisMonth = dateService.getMaxDayOfMonth(year, month);
        // render table head
        var html = [];
        html.push('<tr>');
        html.push('<td>S</td>');
        html.push('<td>M</td>');
        html.push('<td>T</td>');
        html.push('<td>W</td>');
        html.push('<td>T</td>');
        html.push('<td>F</td>');
        html.push('<td>S</td>');
        html.push('</tr>');
        html.push('<tr>');
        // render empty td
        for (var i = 0; i < firstDayOfMonth; i ++) {
            html.push('<td></td>');
        }
        // render first row of calendar
        for (var i = firstDayOfMonth; i < 7; i ++) {
            if ((i + 1 - firstDayOfMonth) === date && year === curYear && month === curMonth) {
                html.push('<td><span class="date-span-selected">' + (i + 1 - firstDayOfMonth) + '</span></td>');
            } else {
                html.push('<td><span>' + (i + 1 - firstDayOfMonth) + '</span></td>');
            }
        }
        html.push('</tr>');
        // render other rows of calendar
        var length = 0;
        for (var i = 7 - firstDayOfMonth + 1; i <= maxDayOfThisMonth; i ++) {
            if (length % 7 === 0) {
                html.push('<tr>');
            }
            if (i === date && year === curYear && month === curMonth) {
                html.push('<td><span class="date-span-selected">' + i + '</span></td>');
            } else {
                html.push('<td><span>' + i + '</span></td>');
            }

            length ++;
            if (length % 7 === 0) {
                html.push('</tr>');
            }
        }
        if (length % 7 !== 0) {
            for (var i = 1; i <= 7 - length % 7; i ++) {
                html.push('<td></td>');
            }
            html.push('</tr>');
        }

        table.html(html.join(''));
    };

    // Runs during compile
    return {
        scope: {},
        restrict: 'E',
        require: ['^ngModel'],
        template: '<div class="date-picker-calendar">\
                        <div class="date-picker-calendar-header" ng-click="onHeaderClick($event)">\
                            <div class="header-direct left-direct">\
                                <span class="last-year-icon"></span>\
                                <span class="last-month-icon"></span>\
                            </div>\
                            <div class="header-label" ng-bind-template={{header}}></div>\
                            <div class="header-direct right-direct">\
                                <span class="next-year-icon"></span>\
                                <span class="next-month-icon"></span>\
                            </div>\
                        </div>\
                        <table class="date-picker-calendar-table" ng-click="onCalendarClick($event)"></table>\
                        <div class="date-time-panel" ng-click="onDateTimeClick($event)">\
                            <div class="hour-selector">\
                                <span class="last-hour-icon"></span>\
                                <input class="hour-panel" ng-model="hour" ng-blur="onHourBlur()"/>\
                                <span class="next-hour-icon"></span>\
                            </div>\
                            :\
                            <div class="minute-selector">\
                                <span class="last-minute-icon"></span>\
                                <input class="minute-panel" ng-model="minute" ng-blur="onMinuteBlur()"/>\
                                <span class="next-minute-icon"></span>\
                            </div>\
                        </div>\
                    </div>',
        replace: true,
        link: function ($scope, iElm, iAttrs, ctrl) {
            var ngModel = ctrl[0];
            var dateFormat = 'yyyy-MM-dd HH:mm';
            var now = new Date();
            var year = +iAttrs.initYear || now.getFullYear();
            var month = +iAttrs.initMonth || (now.getMonth() + 1);
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var container = iElm[0];
            var table = $(container.querySelector('table'));
            renderCalendar(year, month, date, table);
            $scope.hour = now.getHours();
            $scope.minute = now.getMinutes();
            $scope.header = month + ' / ' + year;

            $scope.onHeaderClick = function (e) {
                var target = e.target;
                if (target.className.indexOf('last-year-icon') !== -1) {
                    year --;
                    renderCalendar(year, month, now.getDate(), table);
                    $scope.header = month + ' / ' + year;
                    now.setFullYear(year);
                } else if (target.className.indexOf('last-month-icon') !== -1) {
                    var lastMonth = dateService.getLastMonth(year, month);
                    year = lastMonth.year;
                    month = lastMonth.month;
                    renderCalendar(lastMonth.year, lastMonth.month, now.getDate(), table);
                    $scope.header = month + ' / ' + year;
                    if (month === 2 && now.getDate() > 28) {
                        now.setDate(1);
                    }
                    now.setMonth(month - 1);
                } else if (target.className.indexOf('next-month-icon') !== -1) {
                    var nextMonth = dateService.getNextMonth(year, month);
                    year = nextMonth.year;
                    month = nextMonth.month;
                    renderCalendar(year, month, now.getDate(), table);
                    $scope.header = month + ' / ' + year;
                    if (month === 2 && now.getDate() > 28) {
                        now.setDate(1);
                    }
                    now.setMonth(month - 1);
                } else if (target.className.indexOf('next-year-icon') !== -1) {
                    year ++;
                    renderCalendar(year, month, now.getDate(), table);
                    $scope.header = month + ' / ' + year;
                    now.setFullYear(year);
                }
                e.stopPropagation();
            };

            $scope.onDateTimeClick = function (e) {
                var target = e.target;
                var className = target.className;
                if (className.indexOf('last-hour-icon') !== -1) {
                    hour = (-- hour) % 24;
                    $scope.hour = hour;
                    now.setHours(hour);
                    ngModel.$setViewValue($filter('date')(now, dateFormat));
                } else if (className.indexOf('next-hour-icon') !== -1) {
                    hour = (++ hour) % 24;
                    $scope.hour = hour;
                    now.setHours(hour);
                    ngModel.$setViewValue($filter('date')(now, dateFormat));
                } else if (className.indexOf('last-minute-icon') !== -1) {
                    minute = (-- minute) % 60;
                    $scope.minute = minute;
                    now.setMinutes(minute);
                    ngModel.$setViewValue($filter('date')(now, dateFormat));
                } else if (className.indexOf('next-minute-icon') !== -1) {
                    minute = (++ minute) % 60;
                    $scope.minute = minute;
                    now.setMinutes(minute);
                    ngModel.$setViewValue($filter('date')(now, dateFormat));
                }

                e.stopPropagation();
            };

            $scope.onCalendarClick = function (e) {
                var target = e.target;
                var tagName = target.tagName;
                if (tagName.toLowerCase() === 'span') {
                    var date = +$(target).html();
                    now.setDate(date);
                    now.setHours($scope.hour);
                    now.setMinutes($scope.minute);
                    ngModel.$setViewValue($filter('date')(now, dateFormat));
                    if (iAttrs.onDateClick !== 'undefined') {
                        $scope.$parent[iAttrs.onDateClick](now);
                    }
                }
            };

            $scope.onHourBlur = function () {
                var hour = $scope.hour;
                if (!dateService.isNumber(hour)) {
                    $scope.hour = new Date().getHours();
                } else {
                    hour = +hour;
                    if (hour < 0 || hour > 23) {
                        $scope.hour = new Date().getHours();
                    }
                }
                now.setHours($scope.hour);
                ngModel.$setViewValue($filter('date')(now, dateFormat));
            };
            $scope.onMinuteBlur = function () {
                var minute = $scope.minute;
                if (!dateService.isNumber(minute)) {
                    $scope.minute = new Date().getMinutes();
                } else {
                    minute = +minute;
                    if (minute < 0 || minute > 59) {
                        $scope.minute = new Date().getMinutes();
                    }
                }
                now.setHours($scope.minute);
                ngModel.$setViewValue($filter('date')(now, dateFormat));
            };

            var initDate = new Date(iAttrs.initValue);
            if (dateService.isValidDate(initDate)) {
                // todo set the calendar to the init date
                // renderCalendar(initDate.getFullYear(), initDate.getMonth() + 1, initDate.getDate(), table);
            } else {
                ngModel.$setViewValue($filter('date')(new Date(), dateFormat));
            }
        }
    };
}]);
