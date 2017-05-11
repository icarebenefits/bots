import {combineReducers} from 'redux';

/* Constants */
import {
  SLOGANS,
  TABS,
  SET_COUNTRY,
  SET_SLOGAN,
  SET_TABS,
  SET_ACTIVE_TAB
} from '../constants';

/* initial State */
const initialState = {
  country: '',
  slogan: '',
  tabs: [],
  activeTab: '',
  sidebar: [],
  activeSidebar: ''
};

/* Selectors */
const getSlogan = (id) => {
  if(!id) {
    return 'Bots';
  }
  return SLOGANS[id];
};
const getTabs = (id) => {
  if(!id) {
    return [];
  }
  return TABS[id];
};

const pageControl = (state = initialState, action) => {
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

export const botsApp = combineReducers({
  pageControl
});