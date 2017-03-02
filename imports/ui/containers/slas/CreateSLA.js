import React, {Component, PropTypes} from 'react';

// components
import Button from '../../components/Button';
import QueryBuilder from '../../components/conditions-builder';
import FormInput from '../../components/FormInput';

// fields
import Fields from '/imports/api/fields/custom/fields';
import Condition from '/imports/api/expression/condition';

// methods
import SLAMethods from '/imports/api/collections/slas/methods';

class CreateSLA extends Component {
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

  logPreview(e) {
    e.preventDefault();
    const {query} = this.state;
    // console.log('' + JSON.stringify(query));
    let querybuilt = Condition.buildQuery(query);
    // console.log('' + querybuilt);
    alert(querybuilt);
  }

  _onSubmit(e) {
    e.preventDefault();
    const
      {query: expression} = this.state,
      name = this.refs.name.getValue(),
      tenant = this.refs.name.getValue()
      ;
    // console.log({name, tenant, query});

    SLAMethods.create.call({name, expression, countries: [tenant]}, (error, result) => {
      if(!error) {
        console.log(result);
        // FlowRouter.go('b2b-slas');
      } else {
        alert(error.reason);
      }
    });
  }

  render() {
    const
      listFields = Object.keys(Fields),
      fields = [],
      {handleSaveConditions} = this.props
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

    return (
      <form onSubmit={this._onSubmit.bind(this)}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <label>Conditions Builder</label>
              <QueryBuilder
                fields={fields}
                combinators={combinators}
                operators={operators}
                onQueryChange={this.logQuery}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <label>Name</label>
              <FormInput className="form-control" ref="name"/>
              <label>Tenant</label>
              <FormInput className="form-control" ref="tenant"/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <div style={{marginBottom: 5}}>
                <Button
                  onClick={this.logPreview}
                >Preview</Button>
                {' '}
                <Button
                  type="submit"
                  className="btn-primary"
                >Save</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

CreateSLA.propTypes = {};

export default CreateSLA