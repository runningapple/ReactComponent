import React from 'react';
import ReactDOM from 'react-dom';
import InputDate from './InputDate';

const Component = React.createClass({
  getInitialState() {
    return {
      disabled: false,
      readOnly: false,
      value: 5,
    };
  },
  onChange(value) {
    console.log('onChange:', value);
    this.setState({ value });
  },
  toggleDisabled() {
    this.setState({
      disabled: !this.state.disabled,
    });
  },
  toggleReadOnly() {
    this.setState({
      readOnly: !this.state.readOnly,
    });
  },
  render() {
    return (
      <div style={{ margin: 10 }}>
        <InputDate
          min={-8}
          max={10}
          value={this.state.value}
          style={{ width: 100 }}
          readOnly={this.state.readOnly}
          onChange={this.onChange}
          disabled={this.state.disabled}
        />
        <p>
          <button onClick={this.toggleDisabled}>toggle Disabled</button>
          <button onClick={this.toggleReadOnly}>toggle readOnly</button>
        </p>
      </div>
    );
  },
});

ReactDOM.render(<InputDate />, document.getElementById('app'));