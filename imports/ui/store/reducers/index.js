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
  SLA_CHANGE_MODE,
  SLA_SET_FILTER,
  SLA_SET_SEARCH
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
    mode: 'list',
    visibleSLAs: [],
    SLA: {},
    filter: 'all',
    search: '',
    action: ''
  }
};

/* REDUCERS */
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

const sla = (state = initialState.sla, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_SLA_SIDE_BAR:
      return {
        ...state,
        sidebar: getSidebar(payload)
      };
    case SLA_CHANGE_MODE:
      return {
        ...state,
        mode: payload
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
    default:
      return state;
  }
};

export const botsApp = combineReducers({
  pageControl,
  sla
});