/* SLA Page Actions */

/* CONSTANTS */
import {
  SLA_ACTIVATE,
  SLA_INACTIVATE,
  SLA_REMOVE
} from '../constants/index';

import {actionCreator, addNotification} from './';

/* store */
import {Store} from '../';

/* Job Server */
import JobServer from '/imports/api/jobs/index';

/* Collections */
import SLACollection from '/imports/api/collections/slas/slas';

/* Methods */
import SLAMethods from '/imports/api/collections/slas/methods';

/* Utils */
import {getScheduleText} from '/imports/utils';

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
    SLAMethods[action].call({_id, country}, (err, res) => {
      console.log(action, err, res)
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
