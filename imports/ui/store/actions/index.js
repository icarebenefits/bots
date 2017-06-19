/* CONSTANTS */
import {
  SET_COUNTRY,
  SET_SLOGAN,
  SET_TABS,
  SET_ACTIVE_TAB,
  SET_SLA_SIDE_BAR,
  SLA_SET_FILTER,
  SLA_SET_SEARCH,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
} from '../constants/index';

export const actionCreator = type => (payload = '') => ({type, payload});

export const setCountry = actionCreator(SET_COUNTRY);

export const setSlogan = actionCreator(SET_SLOGAN);

export const setTabs = actionCreator(SET_TABS);

export const setActiveTab = actionCreator(SET_ACTIVE_TAB);

export const setSideBar = type => {
  switch (type) {
    case SET_SLA_SIDE_BAR:
      return actionCreator(SET_SLA_SIDE_BAR);
    default:
      return () => {
      };
  }
};

export const setFilter = type => {
  switch (type) {
    case SLA_SET_FILTER:
      return actionCreator(SLA_SET_FILTER);
    default:
      return () => {
      };
  }
};

export const setSearch = type => {
  switch (type) {
    case SLA_SET_SEARCH:
      return actionCreator(SLA_SET_SEARCH);
    default:
      return () => {
      };
  }
};

/* Notification */
export const addNotification = actionCreator(ADD_NOTIFICATION);
export const removeNotification = actionCreator(REMOVE_NOTIFICATION);

/* SLA Page */
export * from './sla';
