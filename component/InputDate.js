import './less/index.less';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import mixin from './mixin';

function noop() {
}

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
        //if (this.state.yearFocused && document.activeElement !== this.refs.input_year) {
        //    this.refs.input_year.focus();//autofocus
        //}
    },
    onKeyDown(e, ...args) {
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
    selectHour(e) {
        e.preventDefault();
        this.refs.input_hour.select();
    },
    selectMinute(e) {
        e.preventDefault();
        this.refs.input_minute.select();
    },
    handleWheel(e) {
        if (e.deltaY > 0) {
            this.up(e);
        } else {
            this.down(e);
        }
    },
    render() {
        const props = {...this.props};
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

        let inputHourValue = this.state.inputHourValue;
        let inputMinuteValue = this.state.inputMinuteValue;
        // Remove React warning.
        // Warning: Input elements must be either controlled
        // or uncontrolled (specify either the value prop, or
        // the defaultValue prop, but not both).
        delete props.defaultValue;
        // https://fb.me/react-unknown-prop
        delete props.prefixCls;
        // ref for test
        return ( <div className={ classes }
                      style={ props.style }>
                <div className={ `${prefixCls}-handler-wrap` }>
                    <a unselectable="unselectable"
                       ref="up"
                       onTouchEnd={ this.stop }
                       onMouseDown={ this.up }
                       onMouseUp={ this.stop }
                       onMouseLeave={ this.stop }
                       className={ `${prefixCls}-handler-up` }>
            <span unselectable="unselectable"
                  onClick={ preventDefault }>+</span> </a >
                    <a unselectable="unselectable"
                       ref="down"
                       onTouchEnd={ this.stop }
                       onMouseDown={ this.down }
                       onMouseUp={ this.stop }
                       onMouseLeave={ this.stop }
                       className={ `${prefixCls}-handler-down` }>
            <span unselectable="unselectable"
                  onClick={ preventDefault }>-</span></a>
                </div>
                <div className={ `${prefixCls}-input-wrap` }>
                    <input {...props }
                        ref="input_hour"
                        style={ null }
                        className={ `${prefixCls}-hour` }
                        autoComplete="off"
                        onFocus={ this.onHourFocus }
                        onBlur={ this.onBlur }
                        onKeyDown={ this.onKeyDown }
                        readOnly={ props.readOnly }
                        disabled={ props.disabled }
                        name={ props.name }
                        onWheel={this.handleWheel}
                        onClick={ this.selectHour }
                        onChange={ this.onChangeHour }
                        value={ inputHourValue }
                    />:<input {...props }
                    ref="input_minute"
                    style={ null }
                    className={ `${prefixCls}-minute` }
                    autoComplete="off"
                    onFocus={ this.onMinuteFocus }
                    onBlur={ this.onBlur }
                    onKeyDown={ this.onKeyDown }
                    readOnly={ props.readOnly }
                    disabled={ props.disabled }
                    onWheel={this.handleWheel}
                    name={ props.name }
                    onClick={ this.selectMinute }
                    onChange={ this.onChangeMinute }
                    value={ inputMinuteValue }
                />
                </div>
            </div>
        );
    }
});

export default InputDate;
