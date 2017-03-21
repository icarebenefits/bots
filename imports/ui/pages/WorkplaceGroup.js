/**
 * Created by vinhcq on 3/6/17.
 */
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {WorkplaceGroups} from '../../api/collections/facebook'
import Group from './Group'

class WorkplaceGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      country: 'vn',
    };

  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log("name:" + name + " value:" + value);
    this.setState({
      [name]: value
    });
  }

  handleCheck(event) {
    event.preventDefault();
    // Find the text country via the React ref
    const country = this.state.country;// ReactDOM.findDOMNode(this.refs.country).value.trim();
    const inputId = ReactDOM.findDOMNode(this.refs.groupId);
    const inputName = ReactDOM.findDOMNode(this.refs.groupName);
    const groupId = inputId.value;


    Meteor.call('groups.getName', groupId, function (error, result) {
      if (result.error) {
        console.log('error', result.error, result.message);
        alert(result.message);
        // Clear form
        inputId.value = '';
        inputName.value = '';
      }
      else {
        console.log('result', result.name);
        inputName.value = result.name;
      }
    });

  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text country via the React ref
    const country = this.state.country;// ReactDOM.findDOMNode(this.refs.country).value.trim();
    const inputId = ReactDOM.findDOMNode(this.refs.groupId);
    const inputName = ReactDOM.findDOMNode(this.refs.groupName);
    const groupId = inputId.value;
    const groupName = inputName.value;


    Meteor.call('groups.insert', {groupId, groupName, country});
    // Clear form
    inputId.value = '';
    inputName.value = '';
  }

  renderFbGroups() {
    let foundGroups = this.props.groups;
    return foundGroups.map((group) => {
      return (
        <Group key={group._id} group={group}/>
      );

    })
  }

  render() {
    return (
      <div className="container">
        <h1>country: {this.state.country}</h1>
        <div>
          <div>
            <label>
              Group Id:
            </label>

            <input name="groupId"
                   type="text"
                   ref="groupId"
                   placeholder="input groupId"
            />
            <button onClick={this.handleCheck.bind(this)}>check
            </button>
          </div>

          <div>
            <label>
              Group Name:
            </label>
            <input name="groupName" ref="groupName" type="text" readOnly="readOnly"
                   value={this.state.groupName}/>
            <button onClick={this.handleSubmit.bind(this)}>Add
            </button>
          </div>
          <div></div>
          <h2>Workplace groups </h2>
          <table className="table-bordered table">
            <thead className="bg-info">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.renderFbGroups()}
            </tbody>
          </table>

        </div>

      </div>
    );
  };

}

WorkplaceGroup.propTypes = {
  groups: PropTypes.array.isRequired,
};


export default createContainer(() => {
  Meteor.subscribe('groups');
  return {
    groups: WorkplaceGroups.find({}, {sort: {createdAt: -1}}).fetch(),
  };
}, WorkplaceGroup);