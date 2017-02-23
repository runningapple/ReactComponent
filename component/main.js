import React from 'react';
import ReactDOM from 'react-dom';
import InputDate from './InputDate';
import Calendar from 'react-input-calendar'
import './less/calendar.less';

const Component = React.createClass({
	    getInitialState() {
        const { value } = this.props;
        const result = this.initDateTime(value);
        return {
            value: value,
            sDate: result[0],
            sTime: result[1]
        }
    },
    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        const result = this.initDateTime(value);
        this.setState({
            sDate: result[0],
            sTime: result[1]
        });
    },
    initDateTime(value) {
        let sDate = undefined;
        let sTime = '00:00';
        if (value) {
            const dateValue = new Date(value);
            sDate = dateValue.getFullYear() + '-' + (dateValue.getMonth() + 1) + '-' + dateValue.getDate();
            sTime = dateValue.getHours() + ':' + dateValue.getMinutes();
        }
        return [sDate, sTime];
    },
    handleDateChange(sDate) {
        const { sTime } = this.state;
        const value = this.mergeDateAndTime(sDate, sTime);
        // this.props.onChange(value); //when you use component in your project, cancel the annotation
    },
    handleTimeChange(sTime) {
        const { sDate } = this.state;
        const value = this.mergeDateAndTime(sDate, sTime);
        // this.props.onChange(value); //when you use component in your project, cancel the annotation
    },
    mergeDateAndTime(sDate, sTime) {
        let dDate = sDate ? new Date(sDate) : new Date();
        const _hour = sTime.split(':')[0];
        const _minute = sTime.split(':')[1];
        const hour = _hour == '-1' ? '23' : _hour;
        const minute = _minute == '-1' ? '59' : _minute;
        dDate.setHours(parseInt(hour));
        dDate.setMinutes(parseInt(minute));
        this.setState({
            value: dDate,
            sDate: sDate,
            sTime: sTime
        });
        return dDate;
    },
    handleWheel(e) {
    	e.preventDefault();
    	const { sDate } = this.state;
    	let dDate = sDate ? new Date(sDate) : new Date();
    	let day = dDate.getDate();
    	if (e.deltaY < 0) {
    		dDate.setDate(day-1);
    	} else {
    		dDate.setDate(day+1);
    	}
    	const dateValue = new Date(dDate);
        const _sDate = dateValue.getFullYear() + '-' + (dateValue.getMonth() + 1) + '-' + dateValue.getDate();
        this.handleDateChange(_sDate);
    },
    render() {
        const { sDate, sTime } = this.state;
        return ( 
        	<div style={{width: '250px'}}>
                <div style={{float: 'left', width: '65%'}} onWheel={this.handleWheel}>
                    <Calendar format="YYYY-MM-DD" date={sDate} onChange={this.handleDateChange}/>
                </div>
                <div style={{width: '35%', float: 'left'}}>
                    <InputDate style={{float: 'left'}} value={sTime} onChange={this.handleTimeChange}/>
                </div>
            </div>
        );

    }
});

ReactDOM.render( < Component / > , document.getElementById('app'));
