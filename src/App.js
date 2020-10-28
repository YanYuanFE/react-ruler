import React, { useState } from 'react';
import { Form } from 'antd';
import Ruler from './components/ruler';
import RulerInput from './container/RulerInput';
import logo from './assets/logo.svg';
import 'antd/dist/antd.css';

const FormItem = Form.Item;

const App = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(57);

  const handleDragChange = (value) => {
    setValue(value);
  }

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React Ruler Component</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="content">
          <h3>普通用法</h3>
          <div className="custom-ruler">
            <Ruler
                value={value}
                onChange={handleDragChange}
                start={20}
                end={99}
                step={2}
                className="ruler"
            />
          </div>
          <div className="form-ruler">
            <h3>与antd的Form结合使用</h3>
            <Form>
              <FormItem name={'score'} rules={[{ type: 'number' }]} initialValue={13}>
                  <Ruler
                      start={10}
                      end={19}
                      step={1}
                  />
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
  );
}

export default App;
