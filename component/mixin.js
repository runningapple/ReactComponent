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

function leadingZeroHandler(value) {
    if (value == 0) return '00';
    if (value < 10) return '0' + value;
    return value.toString();
}

export default {
    getDefaultProps() {
        return {
            max: Infinity, //Infinity means the positive infinity
            min: 0,
            step: 1,
            style: {},
            defaultValue: '00:00',
            onChange: noop,
            onKeyDown: noop,
            onFocus: noop,
            onBlur: noop
        };
    },
    getInitialState() {
        let _value = undefined;
        const { value } = this.props;
        let _inputHourValue = 0;
        let _inputMinuteValue = 0;
        if (value) {
            _value = _value;
            _inputHourValue = this.toPrecisionAsStep(value.split(":")[0]);
            _inputMinuteValue = this.toPrecisionAsStep(value.split(":")[1]);
        }
        return {
            inputHourValue: leadingZeroHandler(_inputHourValue),
            inputMinuteValue: leadingZeroHandler(_inputMinuteValue),
            hourFocused: undefined,
            minuteFocused: undefined,
            currentFocuse: 1, //remember the latest focuse component in [input_year, input_month, input_day, input_hour, input_minute]
            value: _value
        };
    },
    componentWillReceiveProps(nextProps) {
        let _value = undefined;
        const { value } = nextProps;
        let _inputHourValue = 0;
        let _inputMinuteValue = 0;
        if (value) {
            _value = value;
            _inputHourValue = this.toPrecisionAsStep(value.split(":")[0]);
            _inputMinuteValue = this.toPrecisionAsStep(value.split(":")[1]);
        }
        this.setState({
            inputHourValue: leadingZeroHandler(_inputHourValue),
            inputMinuteValue: leadingZeroHandler(_inputMinuteValue),
            value: _value
        })
    },
    onChange(v1, v2) {
        let _value = '' + v1 + ':' + v2;
        if (this.checkStateValue(v1, v2)) {
            //this.setState({
            //    inputHourValue: v1,
            //    inputMinuteValue: v2,
            //    value: _value
            //});
            this.props.onChange(_value);
        } else {
            //console.log('no change');
        }
    },
    checkStateValue(_v1, _v2) {
        const { inputHourValue, inputMinuteValue } = this.state;
        if (_v1 !== inputHourValue || _v2 !== inputMinuteValue) {
            return true;
        }
        return false;
    },
    onChangeHour(e) {
        const hour = this.getValueFromEvent(e).trim();
        this.setState({
            inputHourValue: hour
        })
    },
    onChangeMinute(e) {
        let minute = this.getValueFromEvent(e).trim();
        this.setState({
            inputMinuteValue: minute
        })
    },
    onHourFocus(...args) {
        this.setFocus(true);
        this.props.onFocus(...args);
    },
    onMinuteFocus(...args) {
        this.setFocus(false, true);
        this.props.onFocus(...args);
    },
    onBlur(e, ...args) {
        const { hourFocused, minuteFocused, inputMinuteValue, inputHourValue } = this.state;
        let _inputHourValue = inputHourValue;
        let _inputMinuteValue = inputMinuteValue;
        if (hourFocused) {
            let currentValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim(), 'hour');
            _inputHourValue = leadingZeroHandler(currentValue);
        } else if (minuteFocused) {
            let currentValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim(), 'minute');
            _inputMinuteValue = leadingZeroHandler(currentValue);
        }
        this.setFocus();
        this.onChange(_inputHourValue, _inputMinuteValue);
        this.props.onBlur(e, ...args);
    },
    getCurrentValidValue(value, types) {
        let val = value;
        const maxV = types == 'hour' ? 23 : 59;
        if (val === '') {
            val = '';
        } else if (!isNaN(val)) {
            val = Number(val);
            if (val < 0) {
                val = 0;
            }
            if (val > maxV) {
                val = maxV;
            }
        } else {
            console.log('transform the input value error!!!');
            val = this.props.defaultValue;
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
    setFocus(f1 = false, f2 = false) {
        let index;
        if (f1) {
            index = 1;
        } else if (f2) {
            index = 2;
        }
        this.setState({
            hourFocused: f1,
            minuteFocused: f2,
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
        const { inputHourValue, inputMinuteValue, currentFocuse } = this.state;
        if (currentFocuse == 1) {
            value = this.getCurrentValidValue(inputHourValue, 'hour');
        } else if (currentFocuse == 2) {
            value = this.getCurrentValidValue(inputMinuteValue, 'minute');
        }
        if (isNaN(value)) {
            return;
        }
        let val = this[`${type}Step`](value); //匹配upStep或者downStep方法调用
        if (currentFocuse == 1) {
            if (parseInt(val) == -1) {
                val = 23;
            }
            this.onChange(parseInt(val) % 24, inputMinuteValue);
            this.setFocus(true);
        } else if (currentFocuse == 2) {
            if (parseInt(val) == -1) {
                val = 59;
            }
            this.onChange(inputHourValue, parseInt(val) % 60);
            this.setFocus(false, true);
        }
    },
    down(e) {
        this.step('down', e);
    },
    up(e) {
        this.step('up', e);
    },
};
