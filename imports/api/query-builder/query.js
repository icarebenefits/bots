import {Operator} from '/imports/api/fields';
import SingleQuery from './single-query';

const Query = ({params, operator = ''}) => {
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
      const {field, values: value} = params;
      const output = SingleQuery().generate({operator, fieldGroup: field, value});
      const query = SingleQuery().build(output);
      return query;
    }
  }
};

export default Query