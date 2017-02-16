import './less/index.less';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import mixin from './mixin';

function noop() {}

function preventDefault(e) {
    e.preventDefault();
}


const InputDate = React.createClass({
    propTypes: {
        onChange: PropTypes.func,
        onKeyDown: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        readOnly: PropTypes.bool,
        max: PropTypes.number,
        min: PropTypes.number,
        maxYear: PropTypes.number,
        minYear: PropTypes.number,
        maxMonth: PropTypes.number,
        minMonth: PropTypes.number, 
        maxDay: PropTypes.number,
        minDay: PropTypes.number,
        size: PropTypes.oneOf(['lg', 'sm']),
        step: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    },
    contextTypes: {
        size: PropTypes.oneOf(['lg', 'sm'])
    },
    mixins: [mixin],
    getDefaultProps() {
        return {
            prefixCls: 'best-input-number'
        };
    },
    componentDidMount() {
        this.componentDidUpdate();
    },
    componentDidUpdate() {
        if (this.state.yearFocused && document.activeElement !== this.refs.input_year) {
            this.refs.input_year.focus();
        }
    },
    onKeyDown(e, ...args) {
        console.log('dd', this.props);
        if (e.keyCode === 38) {
            this.up(e);
        } else if (e.keyCode === 40) {
            this.down(e);
        }
        this.props.onKeyDown(e, ...args);
    },
    getValueFromEvent(e) {
        return e.target.value;
    },
    leadingZeroHnadler(value, info) {
        let result = '';
        switch (info) {
            case 'year':
                if (value == 0) return '0000';
                break;
            case 'month':
                if (value == 0) return '00';
                break;
            case 'date':
                if (value == 0) return '00';
                break;
            default:
                console.log('leading zero error!!!');
        }
        return value.toString();
    },
    render() {
        const props = {...this.props };
        const prefixCls = props.prefixCls;
        let size;
        if ('size' in props) {
            size = props.size;
        } else if ('size' in this.context) {
            size = this.context.size;
        }
        const classes = classNames({
            [prefixCls]: true,
            [props.className]: !!props.className,
            [`${prefixCls}-disabled`]: props.disabled,
            [`${prefixCls}-focused`]: this.state.focused,
            [`${prefixCls}-${size}`]: !!size
        });
        let upDisabledClass = '';
        let downDisabledClass = '';
        const value = this.state.value;
        if (!isNaN(value)) {
            const val = Number(value);
            if (val >= props.max) {
                upDisabledClass = `${prefixCls}-handler-up-disabled`;
            }
            if (val <= props.min) {
                downDisabledClass = `${prefixCls}-handler-down-disabled`;
            }
        } else {
            upDisabledClass = `${prefixCls}-handler-up-disabled`;
            downDisabledClass = `${prefixCls}-handler-down-disabled`;
        }

        const editable = !props.readOnly && !props.disabled;

        // focus state, show input value
        // unfocus state, show valid value

        let inputYearValue = this.leadingZeroHnadler(this.state.inputYearValue, 'year');
        let inputMonthValue = this.leadingZeroHnadler(this.state.inputMonthValue, 'month');
        let inputDayValue = this.leadingZeroHnadler(this.state.inputDayValue, 'date');

        // Remove React warning.
        // Warning: Input elements must be either controlled
        // or uncontrolled (specify either the value prop, or
        // the defaultValue prop, but not both).
        delete props.defaultValue;
        // https://fb.me/react-unknown-prop
        delete props.prefixCls;
        // ref for test
        delete props.maxYear;
        delete props.minYear;
        delete props.maxMonth;
        delete props.minMonth;
        delete props.maxDay;
        delete props.minDay;
        return ( < div className = { classes }
            style = { props.style } >
            < div className = { `${prefixCls}-handler-wrap` } >
            < a unselectable = "unselectable"
            ref = "up"
            onTouchStart = {
                (editable && !upDisabledClass) ? this.up : noop
            }
            onTouchEnd = { this.stop }
            onMouseDown = {
                (editable && !upDisabledClass) ? this.up : noop
            }
            onMouseUp = { this.stop }
            onMouseLeave = { this.stop }
            className = { `${prefixCls}-handler-up ${upDisabledClass}` } >
            < span unselectable = "unselectable"
            onClick = { preventDefault } > + < /span> < /a > < a unselectable = "unselectable"
            ref = "down"
            onTouchStart = {
                (editable && !downDisabledClass) ? this.down : noop
            }
            onTouchEnd = { this.stop }
            onMouseDown = {
                (editable && !downDisabledClass) ? this.down : noop
            }
            onMouseUp = { this.stop }
            onMouseLeave = { this.stop }
            className = { `${prefixCls}-handler-down ${downDisabledClass}` } >
            < span unselectable = "unselectable"
            onClick = { preventDefault } > - < /span> < /a > < /div> < div className = { `${prefixCls}-input-wrap` } > 
            < input {...props }
            ref = "input_year"
            style = { null }
            className = { `${prefixCls}-input` }
            autoComplete = "off"
            onFocus = { this.onYearFocus }
            onBlur = { this.onBlur } 
            onKeyDown = { this.onKeyDown }
            readOnly = { props.readOnly }
            disabled = { props.disabled }
            name = { props.name }
            onChange = { this.onChangeYear }
            value = { inputYearValue }
            />
            年 < input {...props }
            ref = "input_month"
            style = { null }
            className = { `${prefixCls}-input` }
            autoComplete = "off"
            onFocus = { this.onMonthFocus }
            onBlur = { this.onBlur }
            onKeyDown = { this.onKeyDown }
            readOnly = { props.readOnly }
            disabled = { props.disabled }
            name = { props.name }
            onChange = { this.onChangeMonth }
            value = { inputMonthValue }
            />
            月 < input {...props }
            ref = "input_day"
            style = { null }
            className = { `${prefixCls}-input` }
            autoComplete = "off"
            onFocus = { this.onDayFocus }
            onBlur = { this.onBlur }
            onKeyDown = { this.onKeyDown }
            readOnly = { props.readOnly }
            disabled = { props.disabled }
            name = { props.name }
            onChange = { this.onChangeDay }
            value = { inputDayValue }
            />
            日 < /div> < /div >
        );
    }
});

export default InputDate;
