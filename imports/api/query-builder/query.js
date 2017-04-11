import {Operator} from '/imports/api/fields';
import Condition from './condition';
import build from './query-builder';


const getParent = (group) => {
  switch (group) {
    case 'customers': {
      return null;
    }
    case 'business_units': {
      return 'customers';
    }
    case 'icare_members': {
      return 'business_units';
    }
      
  }
};

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
      const output = Condition().generate({operator, fieldGroup: field, value});
      const query = build(output, 'agg');
      return query;
    }
  }
};

export default Query