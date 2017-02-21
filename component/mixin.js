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
        let _value = undefined;
        const { value } = this.props;
        let _inputYearValue = 0;
        let _inputMonthValue = 0;
        let _inputDayValue = 0;
        let _inputHourValue = 0;
        let _inputMinuteValue = 0;
        if (value) {
            _value = new Date(value);
            _inputYearValue = this.toPrecisionAsStep(_value.getFullYear());
            _inputMonthValue = this.toPrecisionAsStep(_value.getMonth());
            _inputDayValue = this.toPrecisionAsStep(_value.getDate());
            _inputHourValue = this.toPrecisionAsStep(_value.getHours());
            _inputMinuteValue = this.toPrecisionAsStep(_value.getMinutes());
        }
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
            value: _value
        };
    },
    componentWillReceiveProps(nextProps) {
        let _value = undefined;
        const { value } = nextProps;
        let _inputYearValue = 0;
        let _inputMonthValue = 0;
        let _inputDayValue = 0;
        let _inputHourValue = 0;
        let _inputMinuteValue = 0;
        if (value) {
            _value = new Date(value);
            _inputYearValue = this.toPrecisionAsStep(_value.getFullYear());
            _inputMonthValue = this.toPrecisionAsStep(_value.getMonth());
            _inputDayValue = this.toPrecisionAsStep(_value.getDate());
            _inputHourValue = this.toPrecisionAsStep(_value.getHours());
            _inputMinuteValue = this.toPrecisionAsStep(_value.getMinutes());
        }
        this.setState({
            inputYearValue: _inputYearValue,
            inputMonthValue: _inputMonthValue,
            inputDayValue: _inputDayValue,
            inputHourValue: _inputHourValue,
            inputMinuteValue: _inputMinuteValue,
            value: _value
        })
    },
    onChange(v1, v2, v3, v4, v5) {
        if (v1 == 0 || v1 == '') {
            this.setState({
                value: undefined,
                inputYearValue: 0,
                inputMonthValue: 0,
                inputDayValue: 0,
                inputHourValue: 0,
                inputMinuteValue: 0
            });
            this.props.onChange(undefined);
            return;
        }
        if (v1 != 0 && v3 == 0) v3 = 1;
        const { maxDate, minDate } = this.props;
        if (isNaN(v1) || isNaN(v2) || isNaN(v3) || isNaN(v4) || isNaN(v5)) return;  //filter the non-number character
        if (v1 > 9999 || v1 < 0 || v2 > 12 || v3 > 31 || v3 < 1 || v4 > 23 || v4 < 0 || v5 > 59 || v5 < 0) return; //filter the number which value overflow
        if (v2 < 0) v2 = 0;
        let _value = new Date();
        _value.setFullYear(parseInt(v1));
        _value.setMonth(parseInt(v2));
        if (new Date(parseInt(v1), parseInt(v2)+1, 0).getDate() < v3) {
            v3 = new Date(parseInt(v1), parseInt(v2)+1, 0).getDate();
        }
        _value.setDate(parseInt(v3));
        _value.setHours(parseInt(v4));
        _value.setMinutes(parseInt(v5));
        _value.setSeconds(0);
        _value.setMilliseconds(0);
        let limitFlag = true;
        if (maxDate && maxDate <= _value.getTime()) limitFlag = false;
        if (minDate && minDate >= _value.getTime()) limitFlag = false;
        //console.log('vv', v1, v2, v3, v4, limitFlag, _value);
        if (this.checkStateValue(v1, v2, v3, v4, v5) && limitFlag) {
            this.setState({
                inputYearValue: v1,
                inputMonthValue: v2,
                inputDayValue: v3,
                inputHourValue: v4,
                inputMinuteValue: v5,
                value: _value
            });
            this.props.onChange(_value);
        } else {
            //this.setState({
            //    inputYearValue: v1,
            //    inputMonthValue: v2,
            //    inputDayValue: v3,
            //    inputHourValue: v4,
            //    inputMinuteValue: v5,
            //});
            console.log('no change');
        }
    },
    /**
     * check new input value is equal to the value in state
     * @param v1
     * @param v2
     * @param v3
     * @param v4
     * @param v5
     */
    checkStateValue(_v1, _v2, _v3, _v4, _v5) {
        const {v1, v2, v3, v4, v5} = this.state;
        if (_v1 !== v1 && _v2 !== v2 && _v3 !== v3 && _v4 !== v4 && _v5 !== v5) {
            return true;
        }
        return false;
    },
    onChangeYear(e) {
        const { inputMonthValue, inputDayValue, inputHourValue, inputMinuteValue } = this.state;
        const year = this.getValueFromEvent(e).trim();
        this.onChange(year, inputMonthValue, inputDayValue, inputHourValue, inputMinuteValue);
    },
    onChangeMonth(e) {
        const { inputYearValue, inputDayValue, inputHourValue, inputMinuteValue } = this.state;
        const month = this.getValueFromEvent(e).trim();
        this.onChange(inputYearValue, month - 1, inputDayValue, inputHourValue, inputMinuteValue);
    },
    onChangeDay(e) {
        let { inputYearValue, inputMonthValue, inputHourValue, inputMinuteValue} = this.state;
        const date = this.getValueFromEvent(e).trim();
        this.onChange(inputYearValue, inputMonthValue, date, inputHourValue, inputMinuteValue);
    },
    onChangeHour(e) {
        const { inputYearValue, inputMonthValue, inputDayValue, inputMinuteValue } = this.state;
        const hour = this.getValueFromEvent(e).trim();
        this.onChange(inputYearValue, inputMonthValue, inputDayValue, hour, inputMinuteValue);
    },
    onChangeMinute(e) {
        const { inputYearValue, inputMonthValue, inputDayValue, inputHourValue } = this.state;
        const minute = this.getValueFromEvent(e).trim();
        this.onChange(inputYearValue, inputMonthValue, inputDayValue, inputHourValue, minute);
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
            _inputMonthValue = currentValue - 1;
        } else if (dayFocused) {
            _inputDayValue = currentValue;
        } else if (hourFocused) {
            _inputHourValue = currentValue;
        } else if (minuteFocused) {
            _inputMinuteValue = currentValue;
        }
        this.setFocus();
        this.onChange(_inputYearValue, _inputMonthValue, _inputDayValue, _inputHourValue, _inputMinuteValue);
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
    toPrecisionAsStep(num) {
        if (isNaN(num) || num === '') {
            return num;
        }
        const precision = this.getPrecision();
        return Number(Number(num).toFixed(Math.abs(precision)));
    },
    upStep(val) {
        return val + 1;
    },
    downStep(val) {
        return val - 1;
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
        if (currentFocuse == 1) {
            if (val >= 9999 || val <= 0) {
                return;
            }
        } else if (currentFocuse == 2) {
            if (val >= 12 || val + 1 <= 0) {
                return;
            }
        } else if (currentFocuse == 3) {
            let maxDay = 32;
            if (inputYearValue && inputMonthValue) {
                maxDay = new Date(inputYearValue, inputMonthValue + 1, 0).getDate() + 1;
            }
            if (val >= maxDay || val <= 0) {
                return;
            }
        } else if (currentFocuse == 4) {
            if (val >= 24 || val + 1 <= 0) {
                return;
            }
        } else if (currentFocuse == 5) {
            if (val >= 60 || val + 1 <= 0) {
                return;
            }
        }
        if (currentFocuse == 1) {
            this.onChange(val, inputMonthValue, inputDayValue, inputHourValue, inputMinuteValue);
            this.setFocus(true);
        } else if (currentFocuse == 2) {
            this.onChange(inputYearValue, val, inputDayValue, inputHourValue, inputMinuteValue);
            this.setFocus(false, true);
        } else if (currentFocuse == 3) {
            this.onChange(inputYearValue, inputMonthValue, val, inputHourValue, inputMinuteValue);
            this.setFocus(false, false, true);
        } else if (currentFocuse == 4) {
            this.onChange(inputYearValue, inputMonthValue, inputDayValue, val, inputMinuteValue);
            this.setFocus(false, false, false, true);
        } else if (currentFocuse == 5) {
            this.onChange(inputYearValue, inputMonthValue, inputDayValue, inputHourValue, val);
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
