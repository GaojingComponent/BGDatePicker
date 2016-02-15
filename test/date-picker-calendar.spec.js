import $ from 'jquery';
// import angular from 'angular';
// import 'angular-mocks';
import '../src/js/bg-date-picker-calendar';

describe('directive:BGDatePickerCalendar', function () {
    var compile, dateService, calendar,
        filter, isolateScope, rootScope;
    var dateFormat = 'yyyy-MM-dd HH:mm';
    var dateFormatWithoutTime = 'yyyy-MM-dd';
    beforeEach(function () {
        angular.mock.module('bg.datePicker.calendar');
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
        isolateScope.$destroy();
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
        isolateScope.onHourBlur();
        expect(isolateScope.hour).toEqual(+hour);
        // more than 24
        isolateScope.hour = 25;
        isolateScope.$digest();
        isolateScope.onHourBlur();
        expect(isolateScope.hour).toEqual(+hour);
    });

    it('should reset the minute panel if the value is invalid on the blur of the minute panel', function () {
        var minute = $('.minute-panel').val();
        // invalid string
        isolateScope.minute = 'invalid minute';
        isolateScope.$digest();
        isolateScope.onMinuteBlur();
        isolateScope.$digest();
        expect(isolateScope.minute).toEqual(+minute);
        // more than 60
        isolateScope.minute = 65;
        isolateScope.$digest();
        isolateScope.onMinuteBlur();
        expect(isolateScope.minute).toEqual(+minute);
    });

});
