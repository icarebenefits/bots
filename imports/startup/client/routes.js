import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// components
import Discover from '../../ui/pages/Discover';

// pages
import ConditionsBuilder from '../../ui/pages/ConditionsBuilder';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(() => (<div>Icare bots</div>));
  },
});

FlowRouter.route('/discovery', {
  name: 'discovery',
  action() {
    mount(Discover);
  },
});


FlowRouter.route('/conditions-builder', {
  name: 'condition-builder',
  action() {
    mount(ConditionsBuilder);
  }
});