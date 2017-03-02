import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

// components
import ConditionsBuilder from '../components/conditions-builder/ConditionsBuilder';
import Button from '../components/Button';
// import QueryBuilder from 'react-querybuilder';
import QueryBuilder from '../components/conditions-builder';

// fields
import Fields from '/imports/api/fields/custom/fields';

// data handler
import {schema} from './schema';

class PreferencesPage extends Component {

  constructor() {
    super();

    this.state = {
      conditions: null,
      expression: null
    };
  }

  _onClick() {
    const expression = this.refs.conditionBuilder.getExpression();
    const conditions = this.refs.conditionBuilder.getConditions();

    this.setState({
      expression
    });
    // console.log(expression);
    // console.log(conditions);
  }

  logQuery(query) {
    console.log(query);
  }

  render() {
    const
      headers = ['Not', 'Parens', 'Filter', 'Description', 'Parens', 'And/Or'],
      {conditions} = schema,
      {expression} = this.state
      ;


    const
      operators = []
      ;
    const {Email} = Fields;

    console.log(Email())

    const fields = [
      {name: 'firstName', label: 'First Name'},
      {name: 'lastName', label: 'Last Name'},
      {name: 'age', label: 'Age'},
      {name: 'address', label: 'Address'},
      {name: 'phone', label: 'Phone'},
      {name: 'email', label: 'Email'},
      {name: 'twitter', label: 'Twitter'},
      {name: 'isDev', label: 'Is a Developer?', value: false},
    ];
    

    return (
      <div className="Preferences">
        <h2>B2B Preferences</h2>
        <h4>Conditions Builder</h4>
        <div>
          
        </div>
      </div>
    );
  }
}

export default PreferencesPage