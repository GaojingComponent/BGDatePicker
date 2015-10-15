<div>
    <style>
        #date-picker-calendar {
            position: absolute;
            width: 187px;
            /*height: 190px;*/
            padding: 5px;
            background-color: #f4f4f4;
            display: none;
        }
        #date-picker-calendar-header {
            width: 100%;
            height: 24px;
            background-color: #cfece9;
        }
        .header-direct {
            float: left;
            height: 100%;
            width: 20px;
        }
        #left-direct {
            margin-left: 15px;
        }
        #right-direct {
            margin-right: 15px;
        }
        #left-direct span {
            float: left;
            width: 6px;
            height: 6px;
            margin-top: 9px;
            cursor: pointer;
        }
        #right-direct span {
            float: right;
            width: 6px;
            height: 6px;
            margin-top: 9px;
            cursor: pointer;
        }
        #last-year-icon {
            background: url(/images/double-left-direct-icon.png) no-repeat center center;
            background-size: 6px 6px;
        }
        #last-month-icon {
            background: url(/images/left-direct-icon.png) no-repeat center center;
            background-size: 6px 6px;
            margin-left: 5px;
        }
        #next-year-icon {
            background: url(/images/double-right-direct-icon.png) no-repeat center center;
            background-size: 6px 6px;
        }
        #next-month-icon {
            background: url(/images/right-direct-icon.png) no-repeat center center;
            background-size: 6px 6px;
            margin-right: 5px;
        }
        #header-label {
            float: left;
            height: 100%;
            width: 100px;
            line-height: 24px;
            text-align: center;
            font-size: 12px;
        }
        #date-picker-calendar-table {
            width: 100%;
            background-color: #FFF;
            font-size: 12px;
        }
        #date-picker-calendar-table td {
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
        }
        #date-picker-calendar-table td span {
            display: inline-block;
            height: 16px;
            width: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            cursor: pointer;
        }
        #date-picker-calendar-table td span:hover {
            background-color: #73d7cd;
            color: #FFF;
        }
        .date-span-selected {
            background-color: #73d7cd;
            color: #FFF;
        }
        #date-time-panel {
            width: 100%;
            height: 16px;
            line-height: 12px;
            margin-top: 5px;
            background-color: #FFF;
            font-size: 12px;
        }
        #hour-selector {
            float: left;
            width: 60px;
            height: 100%;
            margin-left: 25px;
        }
        #next-hour-icon,
        #last-hour-icon,
        #next-minute-icon,
        #last-minute-icon {
            float: left;
            height: 6px;
            width: 6px;
            margin-top: 5px;
            cursor: pointer;
        }
        #next-hour-icon,
        #next-minute-icon {
            background: url(/images/right-direct-icon.png) no-repeat center center;
            background-size: 6px 6px;
        }
        #last-hour-icon,
        #last-minute-icon {
            background: url(/images/left-direct-icon.png) no-repeat center center;
            background-size: 6px 6px;
        }
        #minute-selector {
            float: right;
            width: 42px;
            height: 100%;
            margin-right: 18px;
        }
        #minute-panel,
        #hour-panel {
            float: left;
            width: 30px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            font-size: 12px;
        }
    </style>
    <div id="date-picker-calendar">
        <div id="date-picker-calendar-header">
            <div class="header-direct" id="left-direct">
                <span id="last-year-icon"></span>
                <span id="last-month-icon"></span>
            </div>
            <div id="header-label"></div>
            <div class="header-direct" id="right-direct">
                <span id="next-year-icon"></span>
                <span id="next-month-icon"></span>
            </div>
        </div>
        <table id="date-picker-calendar-table"></table>
        <div id="date-time-panel">
            <div id="hour-selector">
                <span id="last-hour-icon"></span>
                <span id="hour-panel"></span>
                <span id="next-hour-icon"></span>
            </div>
            :
            <div id="minute-selector">
                <span id="last-minute-icon"></span>
                <span id="minute-panel"></span>
                <span id="next-minute-icon"></span>
            </div>
        </div>
    </div>
</div>