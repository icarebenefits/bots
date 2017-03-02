import React, {Component, PropTypes} from 'react';

// components
import Button from '../components/Button';
import QueryBuilder from '../components/conditions-builder';

// fields
import Fields from '/imports/api/fields/custom/fields';
import Operators from '/imports/api/fields/operators';
import Condition from '/imports/api/expression/condition';


class ConditionBuilderTree extends Component {

  constructor() {
    super();

    this.state = {
      query: null,
      startDate: new Date()
    };

    this.logQuery = this.logQuery.bind(this);
    this.logPreview = this.logPreview.bind(this);
  }

  _onFieldChange = (field, value) => {
    console.log({field, value})
  }

  logQuery(query) {
    this.setState({query});
  }

  logPreview() {
    // console.log(this.state.query);
    // console.log(JSON.stringify(this.state.query));
    const {query} = this.state;
    console.log('' + JSON.stringify(query));
    let querybuilt = Condition.buildQuery(query);
    console.log('' + querybuilt);
    alert(querybuilt);
  }

  render() {
    const
      listFields = Object.keys(Fields),
      fields = []
      ;
    let
      combinators = [],
      operators = []
      ;

    // should create function to get data inside of object
    listFields.map(field => {
      const
        {id: name, description: label, operators: ops, getType} = Fields[field](),
        listOps = Object.keys(ops)
        ;
      fields.push({name, label, getType});
      listOps.map(op => {
        const {id: name, description: label} = ops[op];
        operators.push({id: field, name, label});
      });
    });

    combinators = [
      {name: 'and', label: 'And'},
      {name: 'or', label: 'Or'},
    ];

    const {query} = this.state;
    // console.log(query);

    return (
      <div>
        <div>
          <QueryBuilder
            fields={fields}
            combinators={combinators}
            operators={operators}
            onQueryChange={this.logQuery}
          />
          <Button
            onClick={this.logPreview}
          >Preview</Button>
        </div>
      </div>
    );
  }
}

export default ConditionBuilderTree