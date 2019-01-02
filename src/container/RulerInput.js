import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import Ruler from '../components/ruler';

class RulerInput extends Component {
  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    step: PropTypes.number,
  }

  constructor(props) {
    super(props);
    const value = this.props.value;
    this.state = {
      score: value,
    };
  }

  componentDidMount() {
    const { start, end, value } = this.props;
    if (start > value) {
      this.triggerChange(start);
    }
    if (end < value) {
      this.triggerChange(end);
    }
  }

  componentWillReceiveProps(nextProps) {
    if('value' in nextProps) {
      const score = nextProps.value;
      this.setState({score});
    }
  }

  handleChange = (e) => {
    const score = e.target.value;
    if (score) {
      this.setState({score});
      this.triggerChange(score);
    }
  }

  handleDragChange = (score) => {
    this.setState({score});
    this.triggerChange(score);
  }

  triggerChange = (newVal) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(parseInt(newVal, 10));
    }
  }

  render() {
    const { score } = this.state;
    const { start, end, step } = this.props;
    return (
      <div className="ruler-input-wrapper">
        <div className='ruler-input'>
          <Input
            addonAfter="分"
            value={score}
            onChange={this.handleChange}
            style={{width: '148px'}}/>
        </div>
        <Ruler
          value={score}
          start={start}
          end={end}
          step={step}
          onDrag={this.handleDragChange}
        />
      </div>
    );
  }
}

export default RulerInput;
