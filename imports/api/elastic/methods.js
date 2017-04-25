import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

const Methods = {};

Methods.suggest = new ValidatedMethod({
  name: 'elastic.suggest',
  validate: null,
  run({index, type, size, sort, body}) {
    if (!this.isSimulation) {
      const {Elastic} = require('/imports/api/elastic');
      try {
        const result = Elastic.search({index, type, size, sort, body});
        const {suggest: {wp_group}} = result;
        const {options} = wp_group[0];

        return options
        .map(({_source: s}) => ({
          id: s.id,
          name: s.name,
          privacy: s.privacy,
        }));
      } catch (e) {
        throw new Meteor.Error('SEARCH_ERROR', JSON.stringify(e));
      }
    }
  }
});


export default Methods

