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
        if (result.suggest) {
          const {suggest: {wp_group}} = result;
          const {options} = wp_group[0];

          return options
            .map(({_source: s}) => ({
              id: s.id,
              name: s.name,
              privacy: s.privacy,
            }));
        } else {
          return [];
        }
      } catch (err) {
        throw new Meteor.Error('ELASTIC_SUGGEST', err.message);
      }
    }
  }
});

Methods.search = new ValidatedMethod({
  name: 'elastic.search',
  validate: null,
  async run({index, type, body}) {
    try {
      if (!this.isSimulation) {
        const {ElasticClient: Elastic} = require('/imports/api/elastic');

        const searchResult = await Elastic.search({index, type, body});
        const {total, hits} = searchResult;
        return {
          ready: true,
          ...searchResult
        };
      }
    } catch (err) {
      throw new Meteor.Error('ELASTIC_SEARCH', err.message);
    }
  }
});


export default Methods

