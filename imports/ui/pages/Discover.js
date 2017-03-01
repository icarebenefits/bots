import React, {Component} from 'react';
import _ from 'lodash';

// components
import Button from '../components/Button';
import Suggest from '../components/Suggest';
import Select from '../components/Select';
import FormInput from '../components/FormInput';
import Form from '../components/Form';
import Actions from '../components/Actions';
import Dialog from '../components/Dialog';
import schema from './schema';

class Discover extends Component {

  render() {
    let data = JSON.parse(localStorage.getItem('data') || '{}');

    // default example data, read from the schema
    if(_.isEmpty(data)) {
      data= {};
      schema.forEach(item => data[item.id] = item.sample);
      data = [data];
    }
    
    return (
      <div>
        <h1>
          Welcome to the Icare bots
        </h1>

        <h2>Buttons</h2>
        <div>Button with onClick:
          <Button
            onClick={() => console.log(this.refs.select.getValue())}
          >Click me</Button>
        </div>
        <div>A link:
          <Button
            href="http://reactjs.com"
          >Follow me</Button>
        </div>
        <div>Custom class name:
          <Button
          >I do nothing</Button>
        </div>

        <h2>Suggest</h2>
        <div>
          <Suggest
            options={['eenie', 'meenie', 'miney', 'mo']}
          />
        </div>

        <h2>Select</h2>
        <div>
          <Select
            ref="select"
            options={['eenie', 'meenie', 'miney', 'mo']}
          />
        </div>

        <h2>Form inputs</h2>
        <table>
          <tbody>
          <tr>
            <td>Vanilla input</td>
            <td><FormInput /></td>
          </tr>
          <tr>
            <td>Prefilled</td>
            <td><FormInput defaultValue="it's like a default"/></td>
          </tr>
          <tr>
            <td>Suggest</td>
            <td>
              <FormInput
                type="suggest"
                options={['read', 'unread', 'want to read']}
                defaltValue="want to read"
              />
            </td>
          </tr>
          <tr>
            <td>Vanilla textarea</td>
            <td><FormInput type="text"/></td>
          </tr>
          </tbody>
        </table>

        <h2>Form</h2>
        <div>
          <Form
            fields={
            [
          {label: 'First name', type: 'input', id: 'firstName'},
          {label: 'Last name', type: 'input', id: 'lastName'}
        ]
        }
            initialData={{firstName: "Tan", lastName: "Khuu"}}
          >

          </Form>
        </div>

        <h2>Actions</h2>
        <div>
          <Actions onAction={type => alert(type)}/>
        </div>

        <h2>Dialog</h2>
        <div>
          <Dialog
            header="Out-of-the-box example"
            onAction={type => alert(type)}
          >Hello, dialog!
          </Dialog>

          <Dialog
            header="No cancel, custom button"
            hasCancel={false}
            confirmLabel="Whatever"
            onAction={(type) => alert(type)}
          >Anything goes here, see:
            <Button>A button</Button>
          </Dialog>
        </div>

      </div>
    );
  }
}

export default Discover