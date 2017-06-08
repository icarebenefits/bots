/* SLA Page Actions */

/* CONSTANTS */
import {
  SLA_ACTIVATE,
  SLA_INACTIVATE,
  SLA_COPY,
  SLA_PUBLISH,
  SLA_REMOVE,
  SLA_CHANGE_MODE_EDIT,
  SLA_CHANGE_PAGE,
  SLA_SEARCH
} from '../constants/index';

import {addNotification} from './';

/* store */
import {Store} from '../';

/* Collections */
import {SLAs} from '/imports/api/collections/slas';
import {WorkplaceGroups as WPCollection} from '/imports/api/collections/workplaces';

/* Methods */
import SLAMethods from '/imports/api/collections/slas/methods';

/* Utils */
import {getScheduleText} from '/imports/utils';

const actionCreator = type => (payload = '') => ({type, payload});

/* Change mode */
export const onChangeModeEdit = SLA => ({
  type: SLA_CHANGE_MODE_EDIT,
  payload: {SLA}
});

/* Change page */
export const onChangePage = actionCreator(SLA_CHANGE_PAGE);

/* Activate */
export const startAction = (actionType, _id) => {
  switch (actionType) {
    case SLA_ACTIVATE:
    {
      const {sla: {validated}} = Store.getState();
      if (validated) {
        // only activate the validated SLA
        return {
          type: actionType,
          payload: {
            activating: _id
          }
        };
      } else {
        Store.dispatch(addNotification({
          notifyType: 'error',
          title: actionType,
          message: `Can't start the invalid SLA.`
        }));
        return {
          type: actionType,
          payload: {
            activating: null,
            activated: null
          }
        };
      }
    }
    case SLA_INACTIVATE:
      return {
        type: actionType,
        payload: {
          inactivating: _id
        }
      };
    case SLA_COPY:
      return {
        type: actionType,
        payload: {
          copying: _id
        }
      };
    case SLA_PUBLISH:
      return {
        type: actionType,
        payload: {
          publishing: _id
        }
      };
    case SLA_REMOVE:
      return {
        type: actionType,
        payload: {
          removing: _id
        }
      };
    default:
      return {};
  }
};
export const actionOnSLA = (actionType, action, _id) => {
  const {pageControl: {country}} = Store.getState();
  return (dispatch) => {
    dispatch(startAction(actionType, _id));

    // call activate SLA method
    SLAMethods[action].call({_id, country}, (err) => {
      if (err) {
        dispatch(endAction({actionType, error: err.message}))
      } else {
        dispatch(endAction({actionType, _id}));
      }
    });
  };
};
export const endAction = payload => {
  const {actionType, _id, error} = payload;
  if (_id) {
    const action = {type: actionType};
    switch (actionType) {
      case SLA_ACTIVATE:
      {
        action.payload = {
          activating: null,
          activated: _id
        };
        break;
      }
      case SLA_INACTIVATE:
      {
        action.payload = {
          inactivating: null,
          inactivated: _id
        };
        break;
      }
      case SLA_COPY:
      {
        action.payload = {
          copying: null,
          copied: _id,
          dialog: {
            action: 'copy'
          }
        };
        break;
      }
      case SLA_PUBLISH:
      {
        action.payload = {
          publishing: null,
          published: _id,
          dialog: {
            action: 'publish'
          }
        };
        break;
      }
      case SLA_REMOVE:
      {
        action.payload = {
          removing: null,
          removed: _id
        };
      }
    }
    return action;
  } else {
    // action failed
    Store.dispatch(addNotification({
      notifyType: 'error',
      title: actionType,
      message: `Failed: ${error}`
    }));

    const action = {type: actionType};
    switch (actionType) {
      case SLA_ACTIVATE:
      {
        action.payload = {
          activating: null,
          activated: null
        };
        break;
      }
      case SLA_INACTIVATE:
      {
        action.payload = {
          inactivating: null,
          inactivated: null
        };
        break;
      }
      case SLA_COPY:
      {
        action.payload = {
          copying: null,
          copied: null
        };
        break;
      }
      case SLA_PUBLISH:
      {
        action.payload = {
          publishing: null,
          published: null
        };
        break;
      }
      case SLA_REMOVE:
      {
        action.payload = {
          removing: null,
          removed: null
        };
      }
    }
    return action;
  }
};
