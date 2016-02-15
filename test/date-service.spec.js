// import angular from 'angular';
// import 'angular-mocks';
import '../src/js/bg-date-service';
describe('service:dateService', function () {
    var dateService;
    beforeEach(function () {
        angular.mock.module('bg.datePicker.service');
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
