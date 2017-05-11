import {
  SET_COUNTRY,
  SET_SLOGAN,
  SET_USER_PICTURE,
  SET_USER_FULL_NAME,
  SET_TABS,
  SET_ACTIVE_TAB,
  SET_SLA_SIDE_BAR,
  SET_SLA_ACTIVE_SIDE_BAR,
  SLA_CHANGE_MODE
} from '../constants/index';

const actionCreator = type => (payload = '') => ({type, payload});

export const setCountry = actionCreator(SET_COUNTRY);

export const setSlogan = actionCreator(SET_SLOGAN);

export const setTabs = actionCreator(SET_TABS);

export const setActiveTab = actionCreator(SET_ACTIVE_TAB);

export const setSideBar = type => {
  switch (type) {
    case SET_SLA_SIDE_BAR:
      return actionCreator(SET_SLA_SIDE_BAR);
    default:
      return () => {};
  }
};

export const slaChangeMode = actionCreator(SLA_CHANGE_MODE);