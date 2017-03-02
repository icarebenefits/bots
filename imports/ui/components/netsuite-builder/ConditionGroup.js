import React, {Component} from 'react';

import {Condition} from './Condition';

export class ConditionGroup extends Component {
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Not</th>
            <th>Parens</th>
            <th>Filter</th>
            <th>Description</th>
            <th>Parens</th>
            <th>And/Or</th>
            <th>Expression/Action(remove, insert)</th>
          </tr>
        </thead>
        <tbody>
          <Condition />
        </tbody>
      </table>
    );
  }
}