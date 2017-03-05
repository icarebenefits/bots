import React, {Component} from 'react';

export class Label extends Component {
  render() {
    return (
      <span>{this.props.value}</span>
    );
  }
}