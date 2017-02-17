function noop() {
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 *
 */
const SPEED = 200;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
const DELAY = 600;

export default {
    getDefaultProps() {
        return {
            max: Infinity, //Infinity means the positive infinity
            min: 0,
            maxDate: undefined,
            minDate: undefined,
            step: 1,
            style: {},
            defaultValue: new Date().getTime(),
            onChange: noop,
            onKeyDown: noop,
            onFocus: noop,
            onBlur: noop
        };
    },
    getInitialState() {
        let _value;
        const { value, defaultValue, maxDate, minDate } = this.props;
        if (value) {
            _value = new Date(value);
        } else {
            _value = new Date(defaultValue);
        }
        let maxDateArray = this.getMaxDate(maxDate);
        let minDateArray = this.getMinDate(minDate);
        const _inputYearValue = this.toPrecisionAsStep(_value.getFullYear());
        const _inputMonthValue = this.toPrecisionAsStep(_value.getMonth());
        const _inputDayValue = this.toPrecisionAsStep(_value.getDate());
        const _inputHourValue = this.toPrecisionAsStep(_value.getHours());
        const _inputMinuteValue = this.toPrecisionAsStep(_value.getMinutes());
        return {
            inputYearValue: _inputYearValue,
            inputMonthValue: _inputMonthValue,
            inputDayValue: _inputDayValue,
            inputHourValue: _inputHourValue,
            inputMinuteValue: _inputMinuteValue,
            yearFocused: true,
            monthFocused: undefined,
            dayFocused: undefined,
            hourFocused: undefined,
            minuteFocused: undefined,
            currentFocuse: 1, //remember the latest focuse component in [input_year, input_month, input_day, input_hour, input_minute]
            value: _value,
            maxYear: maxDateArray[0],
            minYear: minDateArray[0],
            maxMonth: maxDateArray[1],
            minMonth: minDateArray[1],
            maxDay: maxDateArray[2], //the max date should judge by the year
            minDay: minDateArray[2],
            maxHour: maxDateArray[3],
            minHour: minDateArray[3],
            maxMinute: maxDateArray[4],
            minMinute: minDateArray[4]
        };
    },
    componentWillReceiveProps(nextProps) {
        let _value;
        const { value, defaultValue, maxDate, minDate } = nextProps;
        if (value) {
            _value = new Date(value);
        } else {
            _value = new Date(defaultValue);
        }
        let maxDateArray = this.getMaxDate(maxDate);
        let minDateArray = this.getMinDate(minDate);
        let _inputYearValue = _value.getFullYear();
        let _inputMonthValue = _value.getMonth();
        let _inputDayValue = _value.getDate();
        let _inputHourValue = _value.getHours();
        let _inputMinuteValue = _value.getMinutes();
        _inputYearValue = this.toPrecisionAsStep(_inputYearValue);
        _inputMonthValue = this.toPrecisionAsStep(_inputMonthValue);
        _inputDayValue = this.toPrecisionAsStep(_inputDayValue);
        _inputHourValue = this.toPrecisionAsStep(_inputHourValue);
        _inputMinuteValue = this.toPrecisionAsStep(_inputMinuteValue);
        this.onChange(_inputYearValue, _inputMonthValue, _inputDayValue, _inputHourValue, _inputMinuteValue);
        this.setState({
            maxYear: maxDateArray[0],
            minYear: minDateArray[0],
            maxMonth: maxDateArray[1],
            minMonth: minDateArray[1],
            maxDay: maxDateArray[2], //the max date should judge by the year
            minDay: minDateArray[2],
            maxHour: maxDateArray[3],
            minHour: minDateArray[3],
            maxMinute: maxDateArray[4],
            minMinute: minDateArray[4]
        })
    },
    getMaxDate(maxDate) {
        let year=9999, month=12, day=31, hour=23, minute=59;
        if (maxDate) {
            let _maxDate = new Date(maxDate);
            year = _maxDate.getFullYear();
            month = _maxDate.getMonth();
            day = _maxDate.getDate();
            hour = _maxDate.getHours();
            minute = _maxDate.getMinutes();
        }
        return [year, month, day, hour, minute];
    },
    getMinDate(minDate) {
        let year=0, month=0, day=0, hour=0, minute=0;
        if (minDate) { 
            let _minDate = new Date(minDate);
            year = _minDate.getFullYear();
            month = _minDate.getMonth();
            day = _minDate.getDate();
            hour = _minDate.getHours();
            minute = _minDate.getMinutes();
        }
        return [year, month, day, hour, minute];
    },
    onChange(v1 = this.state.inputYearValue, v2 = this.state.inputMonthValue, v3 = this.state.inputDayValue, v4 = this.state.inputHourValue, v5 = this.state.inputMinuteValue) {
        const value = new Date(parseInt(v1), parseInt(v2) - 1, parseInt(v3), parseInt(v4), parseInt(v5), 0);
        this.setState({
            inputYearValue: v1,
            inputMonthValue: v2,
            inputDayValue: v3,
            inputHourValue: v4,
            inputMinuteValue: v5,
            value: value
        });
    },
    onChangeYear(e) {
        const { maxYear, minYear } = this.state;
        const year = this.getValueFromEvent(e).trim();
        this.onChange(this.validateValue(year, minYear, maxYear));
    },
    onChangeMonth(e) {
        const { maxMonth, minMonth } = this.state;
        const month = this.getValueFromEvent(e).trim();
        this.onChange(undefined, this.validateValue(month, minMonth, maxMonth));
    },
    onChangeDay(e) {
        let { maxDay, minDay , inputYearValue, inputMonthValue} = this.state;
        if (inputYearValue && inputMonthValue) {
            maxDay = new Date(inputYearValue, inputMonthValue, 0).getDate();
        }
        const date = this.getValueFromEvent(e).trim();
        this.onChange(undefined, undefined, this.validateValue(date, minDay, maxDay));
    },
    onChangeHour(e) {
        const { maxHour, minHour } = this.state;
        const hour = this.getValueFromEvent(e).trim();
        this.onChange(undefined, undefined, undefined, this.validateValue(hour, minHour, maxHour));
    },
    onChangeMinute(e) {
        const { maxMinute, minMinute } = this.state;
        const minute = this.getValueFromEvent(e).trim();
        this.onChange(undefined, undefined, undefined, undefined, this.validateValue(minute, minMinute, maxMinute));
    },
    onYearFocus(...args) {
        this.setFocus(true);
        this.props.onFocus(...args); //execute user's function
    },
    onMonthFocus(...args) {
        this.setFocus(false, true);
        this.props.onFocus(...args);
    },
    onDayFocus(...args) {
        this.setFocus(false, false, true);
        this.props.onFocus(...args);
    },
    onHourFocus(...args) {
        this.setFocus(false, false, false, true);
        this.props.onFocus(...args);
    },
    onMinuteFocus(...args) {
        this.setFocus(false, false, false, false, true);
        this.props.onFocus(...args);
    },
    onBlur(e, ...args) {
        const { yearFocused, monthFocused, dayFocused, hourFocused, minuteFocused, inputYearValue, inputMonthValue, inputDayValue, inputMinuteValue, inputHourValue } = this.state;
        let _inputYearValue = inputYearValue;
        let _inputMonthValue = inputMonthValue;
        let _inputDayValue = inputDayValue;
        let _inputHourValue = inputHourValue;
        let _inputMinuteValue = inputMinuteValue;
        const currentValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
        if (yearFocused) {
            _inputYearValue = currentValue;
        } else if (monthFocused) {
            _inputMonthValue = currentValue;
        } else if (dayFocused) {
            _inputDayValue = currentValue;
        } else if (hourFocused) {
            _inputHourValue = currentValue;
        } else if (minuteFocused) {
            _inputMinuteValue = currentValue;
        }
        this.setFocus();
        this.setValue(_inputYearValue, _inputMonthValue, _inputDayValue, _inputHourValue, _inputMinuteValue);
        this.props.onBlur(e, ...args);
    },
    getCurrentValidValue(value) {
        let val = value;
        const props = this.props;
        if (val === '') {
            val = '';
        } else if (!isNaN(val)) {
            val = Number(val);
            if (val < props.min) {
                val = props.min;
            }
            if (val > props.max) {
                val = props.max;
            }
        } else {
            console.log('transform the input value error!!!');
            val = props.defaultValue;
        }
        return this.toPrecisionAsStep(val);
    },
    validateValue(value, minValue, maxValue) {
        if (typeof value === 'undefined' || value === '') value = minValue;
        if (parseInt(value) < parseInt(minValue)) {
            return parseInt(minValue)
        }
        if (parseInt(value) > parseInt(maxValue)) {
            return parseInt(maxValue)
        }
        return parseInt(value);
    },
    setValue(v1, v2, v3, v4, v5) {
        let { inputYearValue, inputMonthValue, maxYear, minYear, maxMonth, minMonth, maxDay, minDay, maxHour, minHour, minMinute, maxMinute } = this.state;
        if (inputYearValue && inputMonthValue) {
            maxDay = new Date(inputYearValue, inputMonthValue, 0).getDate();
        }
        this.onChange(
            this.validateValue(v1, minYear, maxYear),
            this.validateValue(v2, minMonth, maxMonth),
            this.validateValue(v3, minDay, maxDay),
            this.validateValue(v4, minHour, maxHour),
            this.validateValue(v5, minMinute, maxMinute)
        );
    },
    setFocus(f1 = false, f2 = false, f3 = false, f4 = false, f5 = false) {
        let index;
        if (f1) {
            index = 1;
        } else if (f2) {
            index = 2;
        } else if (f3) {
            index = 3;
        } else if (f4) {
            index = 4;
        } else if (f5) {
            index = 5;
        }
        this.setState({
            yearFocused: f1,
            monthFocused: f2,
            dayFocused: f3,
            hourFocused: f4,
            minuteFocused: f5,
            currentFocuse: index
        });
    },
    getPrecision() {
        const props = this.props;
        const stepString = props.step.toString();
        if (stepString.indexOf('e-') >= 0) {
            return parseInt(stepString.slice(stepString.indexOf('e-') + 1), 10);
        }
        let precision = 0;
        if (stepString.indexOf('.') >= 0) {
            precision = stepString.length - stepString.indexOf('.') - 1;
        }
        return precision;
    },
    getPrecisionFactor() {
        const precision = this.getPrecision();
        return Math.pow(10, precision);
    },
    toPrecisionAsStep(num) {
        if (isNaN(num) || num === '') {
            return num;
        }
        const precision = this.getPrecision();
        return Number(Number(num).toFixed(Math.abs(precision)));
    },
    upStep(val) {
        const { step, min } = this.props;
        const precisionFactor = this.getPrecisionFactor();
        let result;
        if (typeof val === 'number') {
            result = (precisionFactor * val + precisionFactor * step) / precisionFactor;
        } else {
            result = min === -Infinity ? step : min;
        }
        return this.toPrecisionAsStep(result);
    },
    downStep(val) {
        const { step, min } = this.props;
        const precisionFactor = this.getPrecisionFactor();
        let result;
        if (typeof val === 'number') {
            result = (precisionFactor * val - precisionFactor * step) / precisionFactor;
        } else {
            result = min === -Infinity ? -step : min;
        }
        return this.toPrecisionAsStep(result);
    },
    step(type, e) {
        if (e) {
            e.preventDefault();
        }
        const props = this.props;
        if (props.disabled) {
            return;
        }
        let value;
        const { inputYearValue, inputMonthValue, inputDayValue, inputHourValue, inputMinuteValue, currentFocuse } = this.state;
        if (currentFocuse == 1) {
            value = this.getCurrentValidValue(inputYearValue);
        } else if (currentFocuse == 2) {
            value = this.getCurrentValidValue(inputMonthValue);
        } else if (currentFocuse == 3) {
            value = this.getCurrentValidValue(inputDayValue);
        } else if (currentFocuse == 4) {
            value = this.getCurrentValidValue(inputHourValue);
        } else if (currentFocuse == 5) {
            value = this.getCurrentValidValue(inputMinuteValue);
        }
        if (isNaN(value)) {
            return;
        }
        const val = this[`${type}Step`](value); //匹配upStep或者downStep方法调用
        if (val > props.max || val < props.min) {
            return;
        }
        if (currentFocuse == 1) {
            this.setValue(val, inputMonthValue, inputDayValue, inputHourValue, inputMinuteValue);
            this.setFocus(true);
        } else if (currentFocuse == 2) {
            this.setValue(inputYearValue, val, inputDayValue, inputHourValue, inputMinuteValue);
            this.setFocus(false, true);
        } else if (currentFocuse == 3) {
            this.setValue(inputYearValue, inputMonthValue, val, inputHourValue, inputMinuteValue);
            this.setFocus(false, false, true);
        } else if (currentFocuse == 4) {
            this.setValue(inputYearValue, inputMonthValue, inputDayValue, val, inputMinuteValue);
            this.setFocus(false, false, false, true);
        } else if (currentFocuse == 5) {
            this.setValue(inputYearValue, inputMonthValue, inputDayValue, inputHourValue, val);
            this.setFocus(false, false, false, false, true);
        }
    },
    down(e) {
        this.step('down', e);
    },
    up(e) {
        this.step('up', e);
    },
};
