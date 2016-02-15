import $ from 'jquery';
// import angular from 'angular';
// import 'angular-mocks';
// 
import '../src/js/bg-date-picker';

describe('directive:BGDatePicker', function () {
    var compile, rootScope, filter, datePicker,
        dateService, selectedDate;//, isolateScope;
    var dateFormat = 'yyyy-MM-dd HH:mm';
    var dateFormatWithoutTime = 'yyyy-MM-dd';
    beforeEach(function () {
        angular.mock.module('bg.datePicker');
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
        $(document.body).trigger('click');
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
