import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import _ from 'lodash';
import moment from 'moment';

/* Collections */
import {ApiProfile, Methods as ApiProfileMethods} from '/imports/api/collections/api-profile';

/* Components */
import {List} from '/imports/ui/components';
import {Spinner} from '/imports/ui/components/common';

/* Notify */
import * as Notify from '/imports/api/notifications';

class ListApiProfile extends Component {
  constructor() {
    super();

    this.handleActions = this.handleActions.bind(this);
  }

  _onRemoveApiProfile(_id) {
    ApiProfileMethods.remove.call({_id}, (err) => {
      if(err) {
        return Notify.error('LIST_API.remove', err.reason);
      }
      return Notify.info('LIST_API.remove', 'success');
    });
  }

  handleActions(action, _id) {
    switch (action) {
      case 'remove':
        return this._onRemoveApiProfile(_id);
      default:
        return Notify.error({title: 'LIST_API', message: `Action: ${action} is unsupported.`});
    }
  }

  render() {
    const {ready} = this.props;
    if (ready) {
      const
        {apiList} = this.props,
        list = {
          noContentLabel: 'API Profile',
          headers: ['Name', 'Endpoint', 'Profile', 'Created at'],
          data: [],
          readonly: true,
          actions: [
            {
              id: 'remove', label: '',
              icon: 'fa fa-times', className: 'btn-danger',
              onClick: this.handleActions
            }],
          handleDoubleClick: () => {
          },
        };

      if (!_.isEmpty(apiList)) {
        list.data = apiList.map(item => ({
          _id: item._id,
          row: [
            {
              id: 'name',
              type: 'input',
              value: item.name
            },
            {
              id: 'endpoint',
              type: 'input',
              value: item.endpoint
            },
            {
              id: 'profile',
              type: 'input',
              value: item.profile
            },
            {
              id: 'createdAt',
              type: 'input',
              value: moment(item.createdAt).format('LLL')
            },
            {}
          ]
        }));
      }

      return (
        <div className="col-md-12">
          <List
            {...list}
          />
        </div>
      );
    }

    return (
      <div><Spinner/></div>
    );
  }
}

ListApiProfile.propTypes = {};

const ListApiProfileContainer = createContainer(() => {
  const
    sub = Meteor.subscribe('api_profile_list'),
    ready = sub.ready(),
    apiList = ApiProfile.find().fetch();

  return {
    ready,
    apiList
  };
}, ListApiProfile);

export default ListApiProfileContainer