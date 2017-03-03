import React, {Component} from 'react';

import {Condition} from './Condition';
import Button from '../Button';

export class ConditionGroup extends Component {

  constructor() {
    super();

    const defaultCondition = [false, '', '', '', '', '', '', ''];

    this.state = {
      defaultCond: defaultCondition,
      conditions: [defaultCondition],
    };

    this._handleOnPreview = this._handleOnPreview.bind(this);
    this._handleAddCondition = this._handleAddCondition.bind(this);
    this.handleInsertCondition = this.handleInsertCondition.bind(this);
    this.handleRemoveCondition = this.handleRemoveCondition.bind(this);
  }

  _handleOnPreview() {
    const
      {conditions} = this.state,
      noOfCond = conditions.length
      ;
    for(i = 0; i < noOfCond; i++) {
      const condition = this.refs[`condition-${i}`];
      conditions.push(condition.getCondition());
    }
    this.setState({
      conditions
    })
  }

  _handleAddCondition() {
    const {defaultCond, conditions} = this.state;
    const newConds = conditions;
    newConds.push(defaultCond);
    this.setState({
      conditions: newConds
    })
  }

  // add a default condition under the condition key
  handleInsertCondition(key) {
    console.log(key)
  }

  handleRemoveCondition(key) {
    console.log(key);
    const
      {conditions} = this.state
      ;
    const newConds = conditions;
    newConds.splice(key, 1);
    this.setState({
      conditions: newConds
    })
  }

  render() {
    const {conditions} = this.state;
    console.log(conditions);

    return (
      <div className="container">
        <div className="row">
          <Button
            className="btn-default"
            onClick={this._handleOnPreview}
          >Preview</Button>
          {' '}
          <Button
            className="btn-default"
            onClick={this._handleAddCondition}
          >Add</Button>
          {' '}
          <Button
            className="btn-default"
            onClick={this.handleRemoveCondition}
          >Remove</Button>
        </div>
        <div className="row">
          <table className="table">
            <thead>
            <tr>
              <th>Not</th>
              <th>Parens</th>
              <th>Filter</th>
              <th>Description</th>
              <th>Parens</th>
              <th>And/Or</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {conditions.map((condition, idx) => {
              return (
                <Condition
                  key={idx}
                  id={idx}
                  ref={`condition-${idx}`}
                  initialCond={condition}
                  handleInsertCondition={this.handleInsertCondition}
                  handleRemoveCondition={this.handleRemoveCondition}
                />
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}