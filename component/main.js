import React from 'react';
import ReactDOM from 'react-dom';
import InputDate from './InputDate';

const Component = React.createClass({
    render() {
        return ( <div style = {{ width: '160px' }}>
            	<InputDate />
            </div>	
        );

    }
});

ReactDOM.render( <Component /> , document.getElementById('app')); 
