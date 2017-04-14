import {Operator} from '/imports/api/fields';
import SingleQuery from './single-query';

const Query = () => ({
  buildQuery: ({params, operator = ''}) => {
    // console.log('Query', JSON.stringify({params, operator}, null, 2))
    switch (operator) {
      case 'not':
      {
        const {query} = params;
        return Operator()[operator]().buildQuery(query);
      }
      case 'and':
      {
        const {queries} = params;
        return Operator()[operator]().buildQuery(queries[0], queries[1]);
      }
      case 'or':
      {
        const {queries} = params;
        return Operator()[operator]().buildQuery(queries[0], queries[1]);
      }
      default:
      {
        const {aggGroup, field: fieldGroup, values: value} = params;
        const query = SingleQuery().buildQuery('parentChild', {aggGroup, operator, fieldGroup, value});
        return query;
      }
    }
  },
  buildAggregation: SingleQuery().buildAggregation,
});

export default Query