import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// data handler
import {schema} from '../../pages/schema';

// functions
import {Expression, Conditions} from '/imports/utils/index';

// components
import ConditionRow from './ConditionRow';
import Form from '../Form';
import Button from '../Button';

class ConditionsBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conditions: props.conditions || [schema.defaultCondition],
      showError: false,
      error: null
    };
  }

  getConditions() {
    return this.state.conditions;
  }

  getExpression() {
    const {conditions} = this.state;

    return Expression.build(conditions);
  }

  _onAddCondition() {
    const
      newConditions = this.state.conditions
      ;

    // verify last condition
    const lastCondition = newConditions[newConditions.length - 1];
    const filterIndex = lastCondition.findIndex(condition => condition.id === 'filter');
    if (filterIndex !== -1) {
      const lastFilterValue = lastCondition[filterIndex].value;
      if (_.isEmpty(lastFilterValue)) {
        return this.setState({
          showError: true,
          error: 'please enter value(s) for filter'
        });
      }
    }

    newConditions.push(schema.defaultCondition);
    this.setState({
      conditions: newConditions
    });
  }

  _onRemoveCondition() {
    const
      newConditions = this.state.conditions,
      row = newConditions.length - 1
      ;
    newConditions.splice(row, 1);
    this.setState({
      conditions: newConditions
    });
  }

  _onSaveConditions() {
    const {conditions} = this.state;

  }

  _renderTable() {
    const
      {headers} = this.props,
      {conditions} = this.state
      ;
    return (
      <table className="table table-bordered">
        <thead>
        <tr>
          {headers.map((title, idx) => {
            return (
              <td key={idx}>{title}</td>
            );
          })}
        </tr>
        </thead>
        <tbody>
        {conditions.map((condition, rowIdx) => {
          return (
            <ConditionRow
              key={rowIdx}
              id={rowIdx}
              ref={`condition-${rowIdx}`}
              cells={condition}
            />
          );
        })}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="row">
          {this._renderTable()}
        </div>
        <div className="row">
          <Button
            type="button"
            className="btn-group btn-default"
            onClick={this._onSaveConditions.bind(this)}
          >Build</Button>
          {' '}
          <Button
            type="button"
            className="btn-group btn-default"
            onClick={this._onAddCondition.bind(this)}
          >Add</Button>
          {' '}
          <Button
            type="button"
            className="btn-group btn-default"
            onClick={this._onRemoveCondition.bind(this)}
          >Remove</Button>
        </div>
      </div>
    );
  }
}

ConditionsBuilder.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  conditions: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.any
    )
  ),
};

export default ConditionsBuilder