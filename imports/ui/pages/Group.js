import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';


export default class Group extends Component {

  deleteThisGroup() {
    Meteor.call('groups.remove', this.props.group._id);
  }

  toSLA() {
    console.log('goto SLA w/ group id:' + this.props.group.id);
  }

  render() {
    return (
      <tr >
        <td>
          {this.props.group.id}
        </td>
        <td>
          {this.props.group.name}
        </td>
        <td className="text-center">
          <button
            className="btn-danger"
            onClick={this.deleteThisGroup.bind(this)}>
            <span className="glyphicon glyphicon-remove"/>
          </button>
        </td>
      </tr>
    );
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
};

