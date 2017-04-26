import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment';
import _ from 'lodash';
import S from 'string';

/* Notify */
import * as Notify from '/imports/api/notifications';

/* Collections */
import {AccessList, Methods} from '/imports/api/collections/access-list';

/* Components */
import {ListAccess} from '../containers';
import {PageSideBar} from '../components';
import {Dialog, FormDialog} from '../components/elements';

class AccessListComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      email: ''
    };

    // render handler
    this._renderListAccess = this._renderListAccess.bind(this);

    // handlers
    this.handleAddEmail = this.handleAddEmail.bind(this);
    this.handleActionAC = this.handleActionAC.bind(this);
    this.handleToolbarChange = this.handleToolbarChange.bind(this);
    this.handleFormDialogChange = this.handleFormDialogChange.bind(this);

    // dialog
    this._renderDialog = this._renderDialog.bind(this);
    this._saveDataDialog = this._saveDataDialog.bind(this);
    this._closeDialog = this._closeDialog.bind(this);

    // functions
    this._getAccessList = this._getAccessList.bind(this);
    this._addAC = this._addAC.bind(this);
  }
  
  handleFormDialogChange(ref, value) {
    return this.setState({
      [`${ref}`]: value
    });
  }

  handleAddEmail() {
    return this.setState({dialog: true});
  }

  handleActionAC(event, action, _id) {
    event.preventDefault();
    switch (action) {
      case 'remove':
      {
        return this._removeAC(_id);
      }
      default:
      {
        return Notify.error({title: `Access list action ${action}`, message: 'Unsupported.'})
      }
    }
  }

  handleToolbarChange(type, value) {
    return this.setState({search: value.toLowerCase()});
  }

  _addAC() {
    const {email} = this.state;
    Methods.create.call({email}, (err) => {
      if (err) {
        return Notify.error({title: `Add email into Access list`, message: `Failed: ${JSON.stringify(err)}`});
      } else {
        return Notify.info({title: `Add email into Access list`, message: 'Success.'});
      }
    });
  }

  _removeAC(_id) {
    Methods.remove.call({_id}, (err) => {
      if (err) {
        return Notify.error({title: `Remove email from Access list`, message: `Failed: ${JSON.stringify(err)}`});
      } else {
        return Notify.info({title: `Remove email from Access list`, message: 'Success.'});
      }
    });
  }

  _getAccessList(search) {
    const {EmailList} = this.props;
    let list = EmailList;

    // fields search: email
    if (!_.isEmpty(search)) {
      list = list
        .filter(item => S(item.email.toLowerCase()).contains(search));
    }

    return list;
  }

  _renderDialog() {
    const {dialog} = this.state;

    if (!dialog) {
      return null;
    }

    const formDialogProps = {
      data: [
        {
          ref: 'email',
          type: 'input',
          value: '',
          handleOnChange: this.handleFormDialogChange
        }
      ]
    };

    return (
      <Dialog
        modal={true}
        header={"Email address: "}
        confirmLabel="Add"
        hasCancel={true}
        onAction={this._saveDataDialog}
      >
        <FormDialog
          {...formDialogProps}
        />
      </Dialog>
    );
  }

  _saveDataDialog(action) {
    switch (action) {
      case 'confirm': {
        this._addAC();
        break;
      }
      case 'dismiss': {
        break;
      }
      default: {
        Notify.error({title: `Dialog action: ${action}`, message: 'Unsupported.'})
      }
    }
    this._closeDialog();
  }

  _closeDialog() {
    return this.setState({
      dialog: false
    });
  }

  _renderListAccess() {
    const
      {search} = this.state,
      listAccessProps = {
        toolbar: {
          buttons: [
            {
              id: 'add',
              className: 'bold green',
              icon: 'fa fa-plus',
              label: 'Add',
              handleOnClick: this.handleAddEmail
            }
          ],
          toolLabel: `tool Label`,
          tools: [],
          hasSearch: true,
          searchPlaceHolder: 'Search by email...',
          handleOnChange: this.handleToolbarChange,
        },
        list: {
          headers: ['Email', 'Created at', 'Updated At'],
          data: [[]],
          readonly: true,
          actions: [
            {
              id: 'remove', label: '',
              icon: 'fa fa-times', className: 'btn-danger',
              handleAction: this.handleActionAC
            },
          ],
          handleDoubleClick: () => {
          },
        },
      };

    const list = this._getAccessList(search);
    listAccessProps.list.data = list.map(item => ({
      _id: item._id,
      row: [
        {id: 'email', type: 'input', value: item.email},
        {
          id: 'createdAt',
          type: 'input',
          value: moment(item.createdAt).format('LLL')
        },
        {
          id: 'updatedAt',
          type: 'input',
          value: moment(item.updatedAt).format('LLL')
        },
        {}
      ]
    }));

    return (
      <ListAccess
        {...listAccessProps}
      />
    );
  }

  render() {
    const {ready} = this.props;
    if (ready) {
      return (
        <div className="page-content-row">
          <PageSideBar
            options={[]}
            active="work"
          />
          <div className="page-content-col">
            <div className="note note-info">
              <h2>
                <span className="label label-primary uppercase"> {`Access List`} </span>
              </h2>
            </div>
            <div className="row">
              {this._renderListAccess()}
            </div>
            <div className="row">
              {this._renderDialog()}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

AccessListComponent.propTypes = {};

const AccessListContainer = createContainer(() => {
  const
    sub = Meteor.subscribe('access.list'),
    ready = sub.ready(),
    EmailList = AccessList.find().fetch();

  return {
    ready,
    EmailList,
  };
}, AccessListComponent);

export default AccessListContainer