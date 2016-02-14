    describe('service:dateService', function () {
        var dateService;
        beforeEach(function () {
            module('bg.datePicker.service');
            inject(function (_DateService_) {
                dateService = _DateService_;
            });
        });
        // test date service
        it('2016 should be a leap year', function () {
            expect(dateService.isLeap(2016)).toEqual(true);
        });
        it('2015 should not to be a leap year', function () {
            expect(dateService.isLeap(2015)).not.toEqual(true);
        });

        it('March should has 31 days', function () {
            expect(dateService.getMaxDayOfMonth(2016, 3)).toEqual(31);
        });
        it('April should has 30 days', function () {
            expect(dateService.getMaxDayOfMonth(2016, 4)).toEqual(30);
        });

        it('First day of 2016.March should be Tuesday', function () {
            expect(dateService.getFirstDayOfMonth(2016, 3)).toEqual(2);
        });
        it('First day of 2016.January should be Friday', function () {
            expect(dateService.getFirstDayOfMonth(2016, 1)).toEqual(5);
        });

        it('The month before 2016.April should be 2016.March', function () {
            expect(dateService.getLastMonth(2016, 4).year).toEqual(2016);
            expect(dateService.getLastMonth(2016, 4).month).toEqual(3);
        });
        it('The month before 2016.January should be 2015.December', function () {
            expect(dateService.getLastMonth(2016, 1).year).toEqual(2015);
            expect(dateService.getLastMonth(2016, 1).month).toEqual(12);
        });

        it('The month after 2016.January should be 2016.February', function () {
            expect(dateService.getNextMonth(2016, 1).year).toEqual(2016);
            expect(dateService.getNextMonth(2016, 1).month).toEqual(2);
        });
        it('The month after 2015.December should be 2016.January', function () {
            expect(dateService.getNextMonth(2015, 12).year).toEqual(2016);
            expect(dateService.getNextMonth(2015, 12).month).toEqual(1);
        });

        it('null should not be a valid date', function () {
            expect(dateService.isValidDate(null)).toEqual(false);
        });
        it('undefined should not be a valid date', function () {
            expect(dateService.isValidDate()).toEqual(false);
        });
        it('String \'invalid date\' should not be a valid date', function () {
            expect(dateService.isValidDate('invalid date')).toEqual(false);
        });
        it('Integer 0 should not be a valide date', function () {
            expect(dateService.isValidDate(0)).toEqual(false);
        });
        it('Date Object should be a valid date', function () {
            expect(dateService.isValidDate(new Date())).toEqual(true);
        });
    });

    describe('directive:BGDatePicker', function () {
        var compile, rootScope, filter, datePicker,
            dateService, selectedDate;//, isolateScope;
        var dateFormat = 'yyyy-MM-dd HH:mm';
        var dateFormatWithoutTime = 'yyyy-MM-dd';
        beforeEach(function () {
            module('bg.datePicker');
            inject(function (_$compile_, _$rootScope_, _$filter_, _DateService_) {
                compile = _$compile_;
                rootScope = _$rootScope_.$new();
                filter = _$filter_;
                dateService = _DateService_;
            });

            var element = '<input type="text" ng-model="now" bg-date-picker></input>';
            rootScope.now = "";
            datePicker = compile(element)(rootScope);
            rootScope.$digest();
            // isolateScope = datePicker.isolateScope();
            datePicker.triggerHandler('click');
        });
        afterEach(function () {
            $('input').remove();
            $('.date-picker-calendar').remove();
            rootScope.$destroy();
        });

        /**
         * click the first day of the calendar
         */
        var clickFirstDate = function (year, month) {
            var firstTd = dateService.getFirstDayOfMonth(year, month);
            $('.date-picker-calendar tr').eq(1).find('td').eq(firstTd).find('span').trigger('click');
        };

        it('should show the calendar on click of the date picker', function () {
            expect($('.date-picker-calendar').css('display')).toEqual('block');
        });
        it('should hide the calendar on click out the date picker', function () {
            $(document.body).triggerHandler('click');
            expect($('.date-picker-calendar').css('display')).toEqual('none');
        });

        it('the date picker should equal to the bind value', function () {
            var now = new Date();
            rootScope.now = filter('date')(now, dateFormat);
            rootScope.$digest();
            expect(datePicker.val()).toEqual(rootScope.now);
        });

        it('should get the correct date on the click of the date', function () {});

    });

    describe('directive:BGDatePickerCalendar', function () {
        var compile, dateService, calendar,
            filter, isolateScope, rootScope;
        var dateFormat = 'yyyy-MM-dd HH:mm';
        var dateFormatWithoutTime = 'yyyy-MM-dd';
        beforeEach(function () {
            module('bg.datePicker');
            inject(function (_$compile_, _$filter_, _$rootScope_,  _DateService_) {
                compile = _$compile_;
                filter = _$filter_;
                rootScope = _$rootScope_.$new();
                dateService = _DateService_;
            });
            rootScope.onDateClick = function (val) {
                // console.log(val);
            };
            rootScope.now = '';
            calendar = compile('<bg-date-picker-calendar on-date-click="onDateClick"'
                + ' ng-model="now" style="left:0px;top:0px;" init-value="">'
                + '</bg-date-picker-calendar>')(rootScope);
            isolateScope = calendar.isolateScope();
            $(document.body).append(calendar);
            calendar.css('display', 'block');
        });
        afterEach(function () {
            calendar.remove();
            rootScope.$destroy();
        });

        /**
         * click the first day of the calendar
         */
        var clickFirstDate = function (year, month) {
            var firstTd = dateService.getFirstDayOfMonth(year, month);
            $('.date-picker-calendar tr').eq(1).find('td').eq(firstTd).find('span').trigger('click');
        };

        it('should add month on the click of the next month icon', function () {
            var now = new Date();
            var nextMonth = dateService.getNextMonth(now.getFullYear(), now.getMonth() + 1);
            now.setYear(nextMonth.year);
            now.setMonth(nextMonth.month - 1);
            now.setDate(1);
            // switch to next month
            $('.next-month-icon').trigger('click');
            expect($('.header-label').html()).toEqual(now.getMonth() + 1 + ' / ' + now.getFullYear());
            // click first date of the month
            clickFirstDate(now.getFullYear(), now.getMonth() + 1);
            expect(rootScope.now.indexOf(filter('date')(now, dateFormatWithoutTime))).not.toEqual(-1);
        });
        it('should minus month on the click of the last month icon', function () {
            var now = new Date();
            var nextMonth = dateService.getLastMonth(now.getFullYear(), now.getMonth() + 1);
            now.setYear(nextMonth.year);
            now.setMonth(nextMonth.month - 1);
            now.setDate(1);
            expect($('.date-picker-calendar').css('display')).toEqual('block');
            // switch to next month
            $('.last-month-icon').trigger('click');
            expect($('.header-label').html()).toEqual(now.getMonth() + 1 + ' / ' + now.getFullYear());
            // click first date of the month
            clickFirstDate(now.getFullYear(), now.getMonth() + 1);
            expect(rootScope.now.indexOf(filter('date')(now, dateFormatWithoutTime))).not.toEqual(-1);
        });

        it('should add year on the click of the next year icon', function () {
            var now = new Date();
            now.setYear(now.getFullYear() + 1);
            now.setDate(1);
            expect($('.date-picker-calendar').css('display')).toEqual('block');
            // switch to next month
            $('.next-year-icon').trigger('click');
            expect($('.header-label').html()).toEqual(now.getMonth() + 1 + ' / ' + now.getFullYear());
            // click first date of the month
            clickFirstDate(now.getFullYear(), now.getMonth() + 1);
            expect(rootScope.now.indexOf(filter('date')(now, dateFormatWithoutTime))).not.toEqual(-1);
        });
        it('should minus year on the click of the last year icon', function () {
            var now = new Date();
            now.setYear(now.getFullYear() - 1);
            now.setDate(1);
            expect($('.date-picker-calendar').css('display')).toEqual('block');
            // switch to next month
            $('.last-year-icon').trigger('click');
            expect($('.header-label').html()).toEqual(now.getMonth() + 1 + ' / ' + now.getFullYear());
            // click first date of the month
            clickFirstDate(now.getFullYear(), now.getMonth() + 1);
            expect(rootScope.now.indexOf(filter('date')(now, dateFormatWithoutTime))).not.toEqual(-1);
        });

        it('should add the hour on the click of the next hour icon', function () {
            var hour = $('.hour-panel').val();
            $('.next-hour-icon').trigger('click');
            expect(+$('.hour-panel').val()).toEqual(+hour + 1);
        });
        it('shoule minus the hour on the click of the last hour icon', function () {
            var hour = $('.hour-panel').val();
            $('.last-hour-icon').trigger('click');
            expect(+$('.hour-panel').val()).toEqual(+hour - 1);
        });

        it('should add the minute on the click of the next minute icon', function () {
            var minute = $('.minute-panel').val();
            $('.next-minute-icon').trigger('click');
            expect(+$('.minute-panel').val()).toEqual(+minute + 1);
        });
        it('should minus the minute on the click of the last minute icon', function () {
            var minute = $('.minute-panel').val();
            $('.last-minute-icon').trigger('click');
            expect(+$('.minute-panel').val()).toEqual(+minute - 1);
        });

        it('should reset the hour panel if the value is invalid on the blur of the hour panel', function () {
            var hour = $('.hour-panel').val();
            // invalid string
            isolateScope.hour = 'invalid hour';
            isolateScope.$digest();
            $('.hour-panel').trigger('blur');
            expect(isolateScope.hour).toEqual(+hour);
            // more than 24
            isolateScope.hour = 25;
            isolateScope.$digest();
            $('.hour-panel').trigger('blur');
            expect(isolateScope.hour).toEqual(+hour);
        });

        it('should reset the minute panel if the value is invalid on the blur of the minute panel', function () {
            var minute = $('.minute-panel').val();
            // invalid string
            isolateScope.minute = 'invalid minute';
            isolateScope.$digest();
            $('.minute-panel').trigger('blur');
            expect(isolateScope.minute).toEqual(+minute);
            // more than 60
            isolateScope.minute = 65;
            isolateScope.$digest();
            $('.minute-panel').trigger('blur');
            expect(isolateScope.minute).toEqual(+minute);
        });

    });
