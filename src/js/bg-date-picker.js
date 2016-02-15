/**
 * @file date picker component
 * @author lakb248@gmail.com
 */
import './bg-date-picker-calendar';

var datePicker = angular.module('bg.datePicker', ['bg.datePicker.calendar']);
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
