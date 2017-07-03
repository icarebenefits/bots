import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session'

/* Functions */
import {error} from '/imports/api/notifications';
/* App State */
import {Store} from '/imports/ui/store';
import * as Actions from '/imports/ui/store/actions';


export const ensureSignedIn = (context, redirect) => {
  if(!Meteor.loggingIn() && !Meteor.userId()) {
    const
      notification = {
      closeButton: true,
      title: 'Authentication',
      message: 'Login is required!'
    },
      currentPath = FlowRouter.current().path;

    Session.set("redirectAfterLogin", currentPath);
    error(notification);

    redirect('/');
  }
};

export const ensureIsAdmin = () => {

};

export const initiatePage = (context) => {
  const {params: {country}, queryParams: {tab: activeTab}} = context;
  Store.dispatch(Actions.setCountry(country));
  Store.dispatch(Actions.setSlogan(country));
  Store.dispatch(Actions.setTabs('setup'));
  Store.dispatch(Actions.setActiveTab(activeTab));
};

export const resetPage = () => {
  Store.dispatch(Actions.setCountry(''));
  Store.dispatch(Actions.setSlogan(''));
  Store.dispatch(Actions.setTabs(''));
  Store.dispatch(Actions.setActiveTab(''));
};