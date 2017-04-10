import React, {Component} from 'react';

// data handler
import {schema} from './schema';

class PreferencesPage extends Component {

  _onClick() {
    const expression = this.refs.conditionBuilder.getExpression();
    const conditions = this.refs.conditionBuilder.getConditions();

    console.log(expression);
    console.log(conditions);
  }

  render() {
    const
      headers = ['Not', 'Parens', 'Filter', 'Description', 'Parens', 'And/Or'],
      {conditions} = schema
      ;

    return (
      <div className="container">
        <h2>B2B Preferences</h2>
        <h4>Conditions Builder</h4>
        <div>
          <ConditionsBuilder
            ref='conditionBuilder'
            conditions={conditions}
            headers={headers}
          />
        </div>
      </div>
    );
  }
}

export default PreferencesPage