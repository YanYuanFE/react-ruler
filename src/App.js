import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'react-redux';
import ReactRuler from '../components/index';
import RulerInput from './RulerInput';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';

const FormItem = Form.Item;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 57
    }
  }

  handleDragChange = (value) => {
    this.setState({value});
  }

  render() {
    const { value } = this.state;
    const { getFieldDecorator } = this.props.form;


    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="content">
          <div className="custom-ruler">
            <ReactRuler
              value={value}
              handleDragChange={this.handleDragChange}
              start={20}
              end={99}
              step={2}
            />
          </div>
          <div className="form-ruler">
            <Form>
              <FormItem>
                {
                  getFieldDecorator('score', {
                    initialValue: 13,
                    rules: [{ type: 'number' }],
                  })(
                    <RulerInput
                      start={10}
                      end={19}
                      step={1}
                    />
                  )
                }
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(App);
