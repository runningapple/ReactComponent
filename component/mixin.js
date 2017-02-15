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
            max: Infinity,
            min: -Infinity,
            step: 1,
            style: {},
            defaultValue: null,
            onChange: noop,
            onKeyDown: noop,
            onFocus: noop,
            onBlur: noop
        };
    },
    getInitialState() {
        let value;
        const props = this.props;
        console.log('props', props)
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }
        const { inputYearValue, inputMonthValue, inputDayValue } = props;
        let _inputYearValue = inputYearValue ? inputYearValue : props.defaultValue;
        let _inputMonthValue = inputMonthValue ? inputMonthValue : props.defaultValue;
        let _inputDayValue = inputDayValue ? inputDayValue : props.defaultValue;
        _inputYearValue = this.toPrecisionAsStep(_inputYearValue);
        _inputMonthValue = this.toPrecisionAsStep(_inputMonthValue);
        _inputDayValue = this.toPrecisionAsStep(_inputDayValue);

        value = this.toPrecisionAsStep(value);
        console.log('props.autoFocus', props.autoFocus);
        return {
            inputValue: value,
            inputYearValue: _inputYearValue,
            inputMonthValue: _inputMonthValue,
            inputDayValue: _inputDayValue,
            value,
            yearFocused: undefined,
            monthFocused: undefined,
            dayFocused: undefined,
            focused: props.autoFocus
        };
    },
    componentWillReceiveProps(nextProps) {
        const { inputYearValue, inputMonthValue, inputDayValue } = nextProps;
        let _inputYearValue = inputYearValue ? inputYearValue : props.defaultValue;
        let _inputMonthValue = inputMonthValue ? inputMonthValue : props.defaultValue;
        let _inputDayValue = inputDayValue ? inputDayValue : props.defaultValue;
        _inputYearValue = this.toPrecisionAsStep(_inputYearValue);
        _inputMonthValue = this.toPrecisionAsStep(_inputMonthValue);
        _inputDayValue = this.toPrecisionAsStep(_inputDayValue);
        this.setState({
            inputValue: value,
            inputYearValue: _inputYearValue,
            inputMonthValue: _inputMonthValue,
            inputDayValue: _inputDayValue,
            value,
        })
        // if ('value' in nextProps) {
        //     const value = this.toPrecisionAsStep(nextProps.value);
        //     this.setState({
        //         inputValue: value,
        //         value
        //     });
        // }
    },
    componentWillUnmount() {
        this.stop();
    },
    onChange(e) {
        this.setInputValue(this.getValueFromEvent(e).trim());
    },
    onYearFocus(...args) {
        this.setState({
            yearFocused: true,
            monthFocused: false,
            dayFocused: false,
        });
        this.props.onFocus(...args);//execute user's function
    },
    onMonthFocus(...args) {
        this.setState({monthFocused: true});
        this.setState({
            yearFocused: false,
            monthFocused: true,
            dayFocused: false,
        });
        this.props.onFocus(...args);
    },
    onDayFocus(...args) {
        this.setState({
            yearFocused: false,
            monthFocused: false,
            dayFocused: true,
        });
        this.props.onFocus(...args);
    },
    onBlur(e, ...args) {
        const { yearFocused, monthFocused, dayFocused } = this.state;
        let inputYearValue, inputMonthValue, inputDayValue;
        if (yearFocused) {
            inputYearValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
        } else if (monthFocused) {
            inputMonthValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
        } else {
            inputDayValue = this.getCurrentValidValue(this.getValueFromEvent(e).trim());
        }
        this.setState({
            yearFocused: false,
            monthFocused: false,
            dayFocused: false,
        });
        // this.setState({focused: false});
        
        this.setValue(inputYearValue, inputMonthValue, inputDayValue);
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
            val = this.state.value;
        }
        return this.toPrecisionAsStep(val);
    },
    setValue(v1, v2, v3) {
        if (!('value' in this.props)) {
            this.setState({
                value: v,
                inputValue: v,
                inputYearValue: v1,
                inputMonthValue: v2,
                inputDayValue: v3,
            });
        }
        const newValue = isNaN(v) || v === '' ? undefined : v;
        if (newValue !== this.state.value) {
            this.props.onChange(newValue);
        } else {
            // revert input value
            this.setState({
                // inputValue: this.state.value
                inputYearValue: this.state.inputYearValue,
                inputMonthValue: this.state.inputMonthValue,
                inputDayValue: this.state.inputDayValue,
            });
        }
    },
    setInputValue(inputValue) {
        const { yearFocused, monthFocused, dayFocused } = this.state;
        if (yearFocused) {
            this.setState({inputYearValue: inputValue});
        } else if (monthFocused) {
            this.setState({inputMonthValue: inputValue});
        } else {
            this.setState({inputDayValue: inputValue});
        }
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
        const value = this.getCurrentValidValue(this.state.value);
        this.setState({value});
        if (isNaN(value)) {
            return;
        }
        const val = this[`${type}Step`](value);
        if (val > props.max || val < props.min) {
            return;
        }
        this.setValue(val);
        this.setState({focused: true});
    },
    stop() {
        if (this.autoStepTimer) {
            clearTimeout(this.autoStepTimer);
        }
    },
    down(e, recursive) {
        if (e.persist) {
            e.persist();
        }
        this.stop();
        this.step('down', e);
        this.autoStepTimer = setTimeout(() => {
            this.down(e, true);
        }, recursive ? SPEED : DELAY);
    },
    up(e, recursive) {
        if (e.persist) {
            e.persist();
        }
        this.stop();
        this.step('up', e);
        this.autoStepTimer = setTimeout(() => {
            this.up(e, true);
        }, recursive ? SPEED : DELAY);
    }
};