/**
 * @file data picker component
 * @author linbin02@baidu.com
 */


(function () {
    var datePicker = angular.module('bg.datePicker', []);
    var $ = angular.element;
    datePicker.directive('bgDatePicker', ['$compile', function ($compile) {
        // Runs during compile
        return {
            restrict: 'A',
            require: ['^ngModel'],
            link: function ($scope, iElm, iAttrs, ctrl) {
                var ngModel = ctrl[0];
                var randomId = (new Date()).getTime();
                var id = iElm.attr('id');
                if (!id) {
                    id = 'input' + randomId;
                    iElm.attr('id', id);
                }
                iElm.attr('data-bind-calendar', randomId);
                iElm.on('click', function (e) {
                    var calendar = document.getElementById(randomId);
                    if (calendar == null) {
                        var target = e.target;
                        var offset = target.getBoundingClientRect();
                        var left = offset.left;
                        var top = offset.top + 5;
                        var scrollTop = document.body.scrollTop;
                        var height = target.offsetHeight;
                        top += height + scrollTop;
                        var datePickerCalendar = $compile('<bg-date-picker-calendar on-date-click="'
                            + iAttrs.onDateClick + '" ng-model="' + iAttrs.ngModel + '" input-id="'
                            + id + '" id="' + randomId + '" style="left:' + left+ 'px;top:'
                            + top + 'px;" init-value="' + ngModel.$modelValue + '"></bg-date-picker-calendar>')($scope);
                        $(document.body).append($(datePickerCalendar));
                    } else {
                        $(calendar).css('display', 'block');
                    }
                });

                $(document.body).on('click', function (e) {
                    var target = $(e.target);
                    if (target.attr('id') !== id) {
                        $(document.getElementById(randomId)).css('display', 'none');
                    }
                });
            }
        };
    }]);

    datePicker.directive('bgDatePickerCalendar', ['$filter', '$parse', function ($filter, $parse) {

        /**
         * if the given year is leap year
         * @param  {Integer} year the year
         * @return {boolean} result the result
         */
        var isLeap = function (year) {
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                return true;
            } else {
                return false;
            }
        };

        /**
         * get the max date of month
         * @param  {Integer} year  the year
         * @param  {Integer} month the month
         * @return {Integer} max the max day of month
         */
        var getMaxDayOfMonth = function (year, month) {
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    return 31;
                case 4:
                case 6:
                case 9:
                case 11:
                    return 30;
                case 2:
                    if (isLeap(year)) {
                        return 29;
                    } else {
                        return 28;
                    }
            }
        };

        /**
         * get the first day of month
         * @param  {Integer} year  the year
         * @param  {Integer} month the month
         * @return {Integer} day the first day
         */
        var getFirstDayOfMonth = function (year, month) {
            var firstDay = 0;
            var century = Math.floor(year / 100);
            var y = year % 100;
            if (month === 1 || month === 2) {
                century = Math.floor((year - 1) / 100);
                y = (year - 1) % 100;
                if (month === 1) {
                    month = 13;
                } else {
                    month = 14;
                }
            }
            firstDay = Math.floor(century / 4) - 2 * century + y
                + Math.floor(y / 4) + Math.floor(13 * (month + 1) / 5);
            firstDay = firstDay % 7;

            while (firstDay < 0) {
                firstDay = firstDay + 70;
            }

            return firstDay % 7;
        };

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
            var firstDayOfMonth = getFirstDayOfMonth(year, month);
            var maxDayOfThisMonth = getMaxDayOfMonth(year, month);
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

        /**
         * get year and month of last month
         * @param  {Integer} year the year
         * @param  {Integer} month the month
         * @return {Object} result the result
         */
        var getLastMonth = function (year, month) {
            if (month === 1) {
                return {
                    year: year - 1,
                    month: 12
                };
            } else {
                return {
                    year: year,
                    month: month - 1
                };
            }
        };

        /**
         * get year and month of this month
         * @param  {Integer} year the year
         * @param  {Integer} month the month
         * @return {Object} result the result
         */
        var getNextMonth = function (year, month) {
            if (month === 12) {
                return {
                    year: year + 1,
                    month: 1
                };
            } else {
                return {
                    year: year,
                    month: month + 1
                };
            }
        };

        /**
         * validate a date object
         * @param  {Object}  date the date object to validate
         * @return {boolean} if the date object is a valid date
         */
        var isValidDate = function (date) {
            if (Object.prototype.toString.call(date) === '[object Date]') {
                if (isNaN(date.getTime())) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };

        // Runs during compile
        return {
            
            restrict: 'E',
            require: ['^ngModel'],
            template: '<div class="date-picker-calendar">\
                            <div class="date-picker-calendar-header">\
                                <div class="header-direct left-direct">\
                                    <span class="last-year-icon"></span>\
                                    <span class="last-month-icon"></span>\
                                </div>\
                                <div class="header-label"></div>\
                                <div class="header-direct right-direct">\
                                    <span class="next-year-icon"></span>\
                                    <span class="next-month-icon"></span>\
                                </div>\
                            </div>\
                            <table class="date-picker-calendar-table"></table>\
                            <div class="date-time-panel">\
                                <div class="hour-selector">\
                                    <span class="last-hour-icon"></span>\
                                    <span class="hour-panel"></span>\
                                    <span class="next-hour-icon"></span>\
                                </div>\
                                :\
                                <div class="minute-selector">\
                                    <span class="last-minute-icon"></span>\
                                    <span class="minute-panel"></span>\
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

                var calendarHeader = $(container.querySelector('.header-label'));
                calendarHeader.html(month + ' / ' + year);

                var hourPanel = $(container.querySelector('.hour-panel'));
                hourPanel.html(hour);

                var minutePanel = $(container.querySelector('.minute-panel'));
                minutePanel.html(minute);

                $(container).css('display', 'block');

                var header = $(container.querySelector('.date-picker-calendar-header'));
                // change the date
                header.on('click', function (e) {
                    var target = e.target;
                    if (target.className.indexOf('last-year-icon') !== -1) {
                        year --;
                        renderCalendar(year, month, now.getDate(), table);
                        calendarHeader.html(month + ' / ' + year);
                        now.setFullYear(year);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    } else if (target.className.indexOf('last-month-icon') !== -1) {
                        var lastMonth = getLastMonth(year, month);
                        year = lastMonth.year;
                        month = lastMonth.month;
                        renderCalendar(lastMonth.year, lastMonth.month, now.getDate(), table);
                        calendarHeader.html(month + ' / ' + year);
                        // js中，如果当前日期大于28后，设置为2月份时
                        // js会认为数据日期溢出，自动会把月份+1,
                        // 因此需要先把日期设置为1号，这样就不会溢出
                        if (month === 2) {
                            now.setDate(1);
                        }
                        now.setMonth(month - 1);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    } else if (target.className.indexOf('next-month-icon') !== -1) {
                        var nextMonth = getNextMonth(year, month);
                        year = nextMonth.year;
                        month = nextMonth.month;
                        renderCalendar(year, month, now.getDate(), table);
                        calendarHeader.html(month + ' / ' + year);
                        if (month === 2) {
                            now.setDate(1);
                        }
                        now.setMonth(month - 1);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    } else if (target.className.indexOf('next-year-icon') !== -1) {
                        year ++;
                        renderCalendar(year, month, now.getDate(), table);
                        calendarHeader.html(month + ' / ' + year);
                        now.setFullYear(year);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    }
                    e.stopPropagation();
                });
                var dateSelector = $(container.querySelector('.date-time-panel'));
                // change the date time
                dateSelector.on('click', function (e) {
                    var target = e.target;
                    var className = target.className;
                    if (className.indexOf('last-hour-icon') !== -1) {
                        hour = (-- hour) % 24;
                        hourPanel.html(hour);
                        now.setHours(hour);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    } else if (className.indexOf('next-hour-icon') !== -1) {
                        hour = (++ hour) % 24;
                        hourPanel.html(hour);
                        now.setHours(hour);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    } else if (className.indexOf('last-minute-icon') !== -1) {
                        minute = (-- minute) % 60;
                        minutePanel.html(minute);
                        now.setMinutes(minute);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    } else if (className.indexOf('next-minute-icon') !== -1) {
                        minute = (++ minute) % 60;
                        minutePanel.html(minute);
                        now.setMinutes(minute);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                    }

                    e.stopPropagation();
                });

                $(container).on('click', function (e) {
                    var target = e.target;
                    var tagName = target.tagName;
                    if (tagName.toLowerCase() === 'span') {
                        var date = +$(target).html();
                        now.setDate(date);
                        now.setHours(0);
                        now.setMinutes(0);
                        ngModel.$setViewValue($filter('date')(now, dateFormat));
                        if (iAttrs.onDateClick !== 'undefined') {
                            $scope[iAttrs.onDateClick](now);
                        }
                    }
                });

                console.log(iAttrs.initValue);

                var initDate = new Date(iAttrs.initValue);
                if (isValidDate(initDate)) {
                    //todo set the calendar to the init date
                } else {
                    ngModel.$setViewValue($filter('date')(new Date(), dateFormat));
                }
            }
        };
    }]);
}());