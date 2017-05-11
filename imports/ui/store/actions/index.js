import {
  SET_COUNTRY,
  SET_SLOGAN,
  SET_USER_PICTURE,
  SET_USER_FULL_NAME,
  SET_TABS,
  SET_ACTIVE_TAB,
  SET_SIDE_BAR,
  SET_ACTIVE_SIDE_BAR
} from '../constants/index';

const actionCreator = type => (payload = '') => ({type, payload});

export const setCountry = actionCreator(SET_COUNTRY);

export const setSlogan = actionCreator(SET_SLOGAN);

export const setTabs = actionCreator(SET_TABS);

export const setActiveTab = actionCreator(SET_ACTIVE_TAB);