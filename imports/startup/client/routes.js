import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

// components
import Discover from '../../ui/components/Discover';

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
