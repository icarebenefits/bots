import React, {Component} from 'react';

// components
import Button from '../components/Button';
import Suggest from '../components/Suggest';
import Form from '../components/Form';

class Discover extends Component {

  componentDidMount() {
    console.log(this.refs);
  }

  render() {
    return (
      <div>
        <h1>List all components in Icare Bots</h1>

        <h2>Buttons</h2>
        <div>Button with onClick:
          <Button onClick={() => alert('button clicked')}>
            Click button
          </Button>
        </div>
        <div>A link:
          <Button href="https://flowtype.org/">
            Follow me
          </Button>
        </div>

        <h2>Suggest</h2>
        <div>
          <Suggest
            options={["durian", "apple", "pine apple", "water melon"]}
            defaultValue="apple"
          />
        </div>

        <h2>Form</h2>
        <div>
          <Form
            fields={[
          {label: 'First name', type: 'input', id: 'firstName'},
          {label: 'LastName', type: 'input', id: 'lastName'}
        ]}
            initialData={{firstName: 'Tan', lastName: 'Khuu'}}
          >
          </Form>
        </div>
      </div>
    );
  }
}

export default Discover