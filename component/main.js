import React from 'react';
import ReactDOM from 'react-dom';
import InputDate from './InputDate';
import Calendar from 'react-input-calendar'
import './less/calendar.less';

function formatDateTime(y, m, d) {
    let result = '';
    for (let i = 0; i < 4 - y.toString().length; i++) {
        result += '0';
    }
    result += y + '-';
    if (m < 10) {
        result += '0';
    }
    result += m + '-';
    if (d < 10) {
        result += '0';
    }
    result += d;
    return result;
}

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
            sDate = formatDateTime(dateValue.getFullYear(), (dateValue.getMonth() + 1), dateValue.getDate());
            sTime = dateValue.getHours() + ':' + dateValue.getMinutes();
        }
        return [sDate, sTime];
    },
    handleDateChange(sDate) {
        const { sTime } = this.state;
        const value = sDate === null ? undefined : this.mergeDateAndTime(sDate, sTime);
        // this.props.onChange(value);
    },
    handleTimeChange(sTime) {
        const { sDate } = this.state;
        const value = this.mergeDateAndTime(sDate, sTime);
        // this.props.onChange(value); //when you use component in your project, cancel the annotation
    },
    mergeDateAndTime(sDate, sTime) {
        if (typeof sDate === 'undefined') {
            const today = new Date();
            sDate = formatDateTime(today.getFullYear(), (today.getMonth() + 1), today.getDate());
        }
        const _sDate = sDate.replace(/-/g, '/');
        let dDate = new Date(_sDate);
        const hour = sTime.split(':')[0];
        const minute = sTime.split(':')[1];
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
        let dDate = new Date();
        if (sDate) {
            dDate = new Date(sDate.replace(/-/g, '/'));
        }
        let day = dDate.getDate();
        if (e.deltaY > 0) {
            dDate.setDate(day - 1);
        } else {
            dDate.setDate(day + 1);
        }
        const dateValue = new Date(dDate);
        const _sDate = formatDateTime(dateValue.getFullYear(), (dateValue.getMonth() + 1), dateValue.getDate());
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
