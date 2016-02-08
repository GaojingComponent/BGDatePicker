define(['angular', 'angularMock', 'jquery', 'bgDatePicker'], function (angular, mock, $) {
    describe('directive:bgSelector', function () {
        var compile, rootScope, datePicker, selectedDate;
        beforeEach(function () {
            module('bg.datePicker');
            inject(function (_$compile_, _$rootScope_) {
                compile = _$compile_;
                rootScope = _$rootScope_.$new();
            });

            var element = '<input type="text" ng-model="now" bg-date-picker></input>';
            rootScope.now = "";
            datePicker = compile(element)(rootScope);
            rootScope.$digest();
        });

        it('should show the calendar on click of the date picker', function () {
            datePicker.triggerHandler('click');
            rootScope.$digest();
            expect($('.date-picker-calendar').css('display')).toEqual('block');
        });
    });
});
