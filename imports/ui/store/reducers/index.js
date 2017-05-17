import {combineReducers} from 'redux';

/* CONSTANTS */
import {
  SLOGANS,
  TABS,
  SIDEBAR,
  SET_COUNTRY,
  SET_SLOGAN,
  SET_TABS,
  SET_ACTIVE_TAB,
  SET_SLA_SIDE_BAR,
  SLA_SET_FILTER,
  SLA_SET_SEARCH,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  SLA_ACTIVATE,
  SLA_INACTIVATE,
  SLA_REMOVE,
  SLA_INIT_SLA,
  SLA_RESET_SLA,
  SLA_CHANGE_MODE_EDIT
} from '../constants';

/* SELECTORS */
const getConstant = (Constant, defaultValue) => {
  return id => {
    if (!id) return defaultValue;
    return Constant[id];
  };
};
const getSlogan = getConstant(SLOGANS, 'Bots');
const getTabs = getConstant(TABS, []);
const getSidebar = getConstant(SIDEBAR, []);

/* INITIAL STATES */
const initialState = {
  pageControl: {
    country: '',
    slogan: '',
    tabs: [],
    activeTab: ''
  },
  sla: {
    SLA: {},
    filter: 'all',
    search: '',
    id: '', // current working sla
    validated: true, // is sla validated or not
    activating: '', // activating sla id in progress
    activated: '', // the last activated sla id
    inactivating: '', // inactivating sla id in progress
    inactivated: '', // the last inactivated sla id
    removing: '', // removing sla id in progress
    removed: '', // the last removed sla id
  },
  notification: {} // {notifyType: (error | info | warning), title, message}
};

/* REDUCERS */
/* Page */
const pageControl = (state = initialState.pageControl, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_COUNTRY:
      return {
        ...state,
        country: payload
      };
    case SET_SLOGAN:
      return {
        ...state,
        slogan: getSlogan(payload)
      };
    case SET_TABS:
      return {
        ...state,
        tabs: getTabs(payload)
      };
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: payload
      };
    default:
      return state;
  }
};

/* Notification */
const notification = (state = initialState.notification, action) => {
  const {type, payload} = action;
  switch (type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        ...payload
      };
    case REMOVE_NOTIFICATION:
      return initialState.notification;
    default:
      return state;
  }
};

/* SLA */
const sla = (state = initialState.sla, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_SLA_SIDE_BAR:
      return {
        ...state,
        sidebar: getSidebar(payload)
      };
    case SLA_SET_FILTER:
      return {
        ...state,
        filter: payload
      }
    case SLA_SET_SEARCH:
      return {
        ...state,
        search: payload.toLowerCase()
      };
    case SLA_ACTIVATE:
    case SLA_INACTIVATE:
    case SLA_REMOVE:
    case SLA_INIT_SLA:
    case SLA_RESET_SLA:
    case SLA_CHANGE_MODE_EDIT:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
};

export const botsApp = combineReducers({
  pageControl,
  sla,
  notification
});