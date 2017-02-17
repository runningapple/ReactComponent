function noop() {}

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
                maxYear: 9999,
                minYear: 0,
                maxMonth: 12,
                minMonth: 0,
                maxDay: 31, //the max date should judge by the year
                minDay: 0,
                maxHour: 12,
                minHour: 0,
                maxMinute: 59,
                minMinute: 0,
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
            const props = this.props;
            let value;
            if ('value' in props) {
                value = new Date(props.value);
            } else {
                value = new Date(props.defaultValue);
            }
            let _inputYearValue = value.getFullYear();
            let _inputMonthValue = value.getMonth();
            let _inputDayValue = value.getDate();
            _inputYearValue = this.toPrecisionAsStep(_inputYearValue);
            _inputMonthValue = this.toPrecisionAsStep(_inputMonthValue);
            _inputDayValue = this.toPrecisionAsStep(_inputDayValue);
            _inputHourValue = this.toPrecisionAsStep(_inputHourValue);
            _inputMinuteValue = this.toPrecisionAsStep(_inputMinuteValue);
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
                currentFocuse: 1,   //remember the latest focuse component in [input_year, input_month, input_day]
                value
            };
        },
        componentWillReceiveProps(nextProps) {
            let value;
            if ('value' in nextProps) {
                value = new Date(props.value);
            } else {
                value = new Date(props.defaultValue);
            }
            let _inputYearValue = value.getFullYear();
            let _inputMonthValue = value.getMonth();
            let _inputDayValue = value.getDate();
            let _inputHourValue = value.getHours();
            let _inputMinuteValue = value.getMinutes();
            _inputYearValue = this.toPrecisionAsStep(_inputYearValue);
            _inputMonthValue = this.toPrecisionAsStep(_inputMonthValue);
            _inputDayValue = this.toPrecisionAsStep(_inputDayValue);
            _inputHourValue = this.toPrecisionAsStep(_inputHourValue);
            _inputMinuteValue = this.toPrecisionAsStep(_inputMinuteValue);
            this.onChange(_inputYearValue, _inputMonthValue, _inputDayValue, _inputHourValue, _inputMinuteValue);
        },
        onChange(v1 = this.state.inputYearValue, v2 = this.state.inputMonthValue, v3 = this.state.inputDayValue) {
            let value = new Date(parseInt(v1), parseInt(v2) - 1, parseInt(v3));
            this.setState({
                inputYearValue: v1,
                inputMonthValue: v2,
                inputDayValue: v3,
                inputHourValue: v4,
                inputMinuteValue: v5,
                value
            });
        },
        onChangeYear(e) {
            const { maxYear, minYear } = this.props;
            const year = this.getValueFromEvent(e).trim();
            this.onChange(this.validateValue(year, minYear, maxYear));
        },
        onChangeMonth(e) {
            const { maxMonth, minMonth } = this.props;
            const month = this.getValueFromEvent(e).trim();
            this.onChange(undefined, this.validateValue(month, minMonth, maxMonth));
        },
        onChangeDay(e) {
            const { maxDay, minDay } = this.props;
            const date = this.getValueFromEvent(e).trim();
            this.onChange(undefined, undefined, this.validateValue(date, minDay, maxDay));
        },
        onYearFocus(...args) {
            this.setFocus(true, false, false);
            this.props.onFocus(...args); //execute user's function
        },
        onMonthFocus(...args) {
            this.setFocus(false, true, false);
            this.props.onFocus(...args);
        },
        onDayFocus(...args) {
            this.setFocus(false, false, true);
            this.props.onFocus(...args);
        },
        onBlur(e, ...args) {
            const { yearFocused, monthFocused, dayFocused, inputYearValue, inputMonthValue, inputDayValue } = this.state;
            let _inputYearValue = inputYearValue;
            let _inputMonthValue = inputMonthValue;
            let _inputDayValue = inputDayValue;
            if (yearFocused) {
                _inputYearValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
            } else if (monthFocused) {
                _inputMonthValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
            } else {
                _inputDayValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
            }
            this.setFocus(false, false, false);
            this.setValue(_inputYearValue, _inputMonthValue, _inputDayValue);
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
        setValue(v1, v2, v3) {
            const { maxYear, minYear, maxMonth, minMonth, maxDay, minDay } = this.props;
            this.onChange(
                this.validateValue(v1, minYear, maxYear),
                this.validateValue(v2, minMonth, maxMonth),
                this.validateValue(v3, minDay, maxDay)
            );
        },
        setFocus(f1, f2, f3) {
            let index;
            if (f1) {
               index = 1; 
            } else if (f2) {
                index = 2;
            } else if (f3) {
                index = 3;
            }
            this.setState({
                yearFocused: f1,
                monthFocused: f2,
                dayFocused: f3,
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
            const { inputYearValue, inputMonthValue, inputDayValue, currentFocuse } = this.state;
            if (currentFocuse == 1) { 
                value = this.getCurrentValidValue(inputYearValue);
            } else if (currentFocuse == 2) {
                value = this.getCurrentValidValue(inputMonthValue);
            } else if (currentFocuse == 3) {
                value = this.getCurrentValidValue(inputDayValue);
            }
            if (isNaN(value)) {
                return;
            }
            const val = this[`${type}Step`](value); //匹配upStep或者downStep方法调用
            if (val > props.max || val < props.min) {
                return;
            }
            if (currentFocuse == 1) {
                this.setValue(val, inputMonthValue, inputDayValue);
                this.setFocus(true, false, false);
            } else if (currentFocuse == 2) {
                this.setValue(inputYearValue, val, inputDayValue);
                this.setFocus(false, true, false);
            } else if (currentFocuse == 3) {
                this.setValue(inputYearValue, inputMonthValue, val);
                this.setFocus(false, false, true);
            }
        },
        down(e) {
            this.step('down', e);
        },
        up(e) {
            this.step('up', e);
        },
};
