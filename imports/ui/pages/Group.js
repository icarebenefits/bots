import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import classnames from 'classnames';


export default class Group extends Component {

  deleteThisGroup() {
    Meteor.call('groups.remove', this.props.group._id);
  }

  render() {

    const GroupClassName = classnames({
      private: this.props.group.private,
    });


    return (
      <tr >
        <td>
          {this.props.group.facebookId}
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

