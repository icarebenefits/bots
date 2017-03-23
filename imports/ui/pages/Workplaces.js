import React, {Component, PropTypes} from 'react';

import {Form} from '../components/elements'
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {WorkplaceGroups} from '../../api/collections/workplaces'
import Group from './Group'
import {FlowRouter} from 'meteor/kadira:flow-router';

import {
  PageSideBar
} from '../components';

class Workplaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: FlowRouter.getParam("country"),
      showName: true
    };
  }

  renderFbGroups() {
    let filteredGroups = this.props.groups;
    return filteredGroups.map((group) => {
      return (
        <Group key={group._id} group={group}/>
      );

    })
  }

  showName(value) {
    this.setState({
      showName: value
    });
  }

  handleCheck(event) {
    event.preventDefault();
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
    // this.showName(true);
  }

  handleSubmit(event) {
    event.preventDefault();
    const country = this.state.country;
    const inputId = ReactDOM.findDOMNode(this.refs.groupId);
    const inputName = ReactDOM.findDOMNode(this.refs.groupName);
    const groupId = inputId.value;
    const groupName = inputName.value;

    Meteor.call('groups.insert', {groupId, groupName, country});
    // Clear form
    inputId.value = '';
    inputName.value = '';
    // this.showName(false);
  }

  render() {
    const fields = [
      {
        id: 'name', label: 'Group name', type: 'string', value: '',
        className: 'form-control',
        handleOnChange: (value) => console.log('input value: ', value)
      },
      {
        id: 'id', label: 'Group ID', type: 'string', value: '',
        className: 'form-control',
        handleOnChange: (value) => console.log('input value: ', value)
      }
    ];
    const show = {
      'display': this.state.showName ? 'block' : 'none'
    };


    return (
      <div className="page-content-row">
        <PageSideBar
          options={[]}
          active="work"
        />
        <div className="page-content-col">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="groupId">
                  GroupId
                </label>
                <div className="input-group">
                  <input name="groupId"
                         type="text"
                         ref="groupId"
                         placeholder="workplace groupId..."
                  />
                  <button className="btn-link" onClick={this.handleCheck.bind(this)}>GetName
                  </button>
                </div>
              </div>

              <div className="form-group" style={show}>
                <label htmlFor="groupName">
                  GroupName
                </label>
                <div className="input-group">

                  <input name="groupName" ref="groupName" type="text" readOnly="readOnly"/>
                  <button className="btn-success" onClick={this.handleSubmit.bind(this)}>Save
                  </button>
                </div>
              </div>

            </div>
            <div className="col-md-8">
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
        </div>
      </div>
    );
  }
}

Workplaces.propTypes = {
  groups: PropTypes.array.isRequired,
};


export default createContainer(() => {
  Meteor.subscribe('groups');
  return {
    groups: WorkplaceGroups.find({country: FlowRouter.getParam("country")}, {sort: {createdAt: -1}}).fetch(),
  };
}, Workplaces);