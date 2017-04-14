import {check} from 'meteor/check';
import bodybuilder from 'bodybuilder';
import _ from 'lodash';

import {Field, Operator} from '/imports/api/fields';

/**
 *
 * @param condition
 * @param parent
 * @return {{}}
 */
const buildTree = (condition, parent) => {
  let node = {};
  condition
    .filter(c => c.parent === parent)
    .forEach(c => {
      if (c.value) {
        node = {
          type: c.type,
          value: c.value,
          field: c.field,
        };
      } else {
        node = {
          type: 'nested',
          field: {path: c.field},
          child: buildTree(condition, c.field)
        }
      }
    });
  return node;
};

/**
 *
 * @param object
 * @param queryType
 * @return {{nest: (function())}}
 */
const nested = (object, queryType = 'query') => {
  const {type, field} = object;
  let nest = () => {
  };
  if (!_.isEmpty(object.child)) {
    if (queryType === 'agg') {
      let name = '';
      field.path ? name = field.path : name = field;
      nest = (q) => {
        return q
          .agg(type, field, name, nested(object.child, queryType).nest);
      };
    } else {
      nest = (q) => {
        return q
          .query(type, field, nested(object.child, queryType).nest);
      };
    }
  } else {
    const {value} = object;
    if (queryType === 'agg') {
      nest = (q) => {
        return q
          .agg(type, field)
      };
    } else {
      nest = (q) => {
        return q
          .query(type, field, value)
      };
    }
  }

  return {nest};
};

/**
 *
 * @param field
 * @return {*}
 */
const getParentGroup = (field) => {
  switch (field) {
    case 'business_units.icare_members.loans':
    {
      return 'iCareMember';
    }
    case 'business_units.icare_members':
    {
      return 'BusinessUnit';
    }
    case 'business_units':
    {
      return 'Customer';
    }
    case 'customers':
    {
      return null;
    }
  }
};

/**
 * Create input for nested query
 * @param field
 * @param parent
 * @param operator
 * @param value
 * @param output
 * @return {*}
 */
const createInput = ({field, parent, operator, value}, output) => {
  if (operator) {
    // get params
    const params = Operator()[operator]().getParams(field, value);
    output.push({...params, parent});
    const group = getParentGroup(parent);
    if (group) {
      const {field: f} = Field()[group]().elastic();
      createInput({field: parent, parent: f}, output);
    } else {
      createInput({field: parent, parent: null}, output);
    }
  } else {
    if (parent) {
      output.push({field, parent});
      const group = getParentGroup(parent);
      if (group) {
        const {field: f} = Field()[group]().elastic();
        createInput({field: parent, parent: f}, output);
      } else {
        createInput({field: parent, parent: null}, output);
      }
    } else {
      output.push({field, parent});
    }
  }

  return output;
};

/**
 *
 * @param operator
 * @param fieldGroup
 * @param value
 * @return {*}
 */
const formatNestedInput = ({operator, fieldGroup, value}) => {
  /*
   Input
   operator: greaterThan
   field: {group: 'Loans', name: 'totalPrincipalAmount'}
   value: [{type: 'string', value: 430}]
   Output
   [
   {field: 'customers', parent: null},
   {field: 'business_units', parent: 'customers',},
   {field: 'business_units.icare_members', parent: 'business_units'},
   {field: 'business_units.icare_members.loans', parent: 'business_units.icare_members'},
   {field: 'business_units.icare_members.loans.totalPrincipalAmount', parent: 'business_units.icare_members.loans', type: 'range', value: {gte: 430}},
   ];
   */

  const {group, name} = fieldGroup;
  const {parent, child} = Field()[group]().elastic();

  const input = createInput({
    field: parent ? `${field}.${name}` : name,
    parent: `${field}`,
    operator, value
  }, []);

  return input;
};

/**
 * Build the nested query - support both query and aggregation query
 * @param operator
 * @param fieldGroup
 * @param value
 * @param queryType
 * @return {bodybuilder}
 */
/** Example:
 const query = SingleQuery().buildQuery('nested', { operator, fieldGroup: field, value}, 'query');
 */
const buildNestedQuery = ({operator, fieldGroup, value}, queryType = 'query') => {
  const input = formatNestedInput({operator, fieldGroup, value});
  const customers = buildTree(input, null).child;

  const {type, field} = customers;
  let body = bodybuilder();
  if (type === 'nested') {
    const {nest} = nested(customers.child, queryType);
    if (queryType === 'agg') {
      let name = '';
      field.path ? name = field.path : name = field;
      body = body
        .agg(type, field, name, nest)
        .build()
      ;
    } else {
      body = body
        .query(type, field, nest)
        .build()
      ;
    }
  } else {
    const {value} = customers;
    if (queryType === 'agg') {
      body = body
        .agg(type, field)
        .build()
    } else {
      body = body
        .query(type, field, value)
        .build()
    }
  }
  return body;
};

/**
 * build query base on relation between aggGroup and queryGroup
 * @param aggGroup - (grandParent, parent, type, child, grandChild)
 * @param queryGroup - (grandParent, parent, type, child, grandChild)
 */
const buildParentChildQuery = ({aggGroup, operator, fieldGroup, value}) => {
  const {group: queryGroup, name} = fieldGroup;
  const agg = Field()[aggGroup]().elastic();
  const query = Field()[queryGroup]().elastic();
  const {type, field, value: val} = Operator()[operator]().getParams(name, value);

  // console.log('agg', JSON.stringify(agg));
  // console.log('query', JSON.stringify(query));
  // console.log('data', JSON.stringify({type, field, val}))

  /* agg is grand parent of query */
  if (!_.isEmpty(query.grandParent) && agg.type === query.grandParent) {
    /* build 2 has_child query */
    return bodybuilder()
      .query('has_child', {type: `${query.parent}`}, (q) => {
        return q
          .query('has_child', {type: `${query.type}`}, (q) => {
            return q
              .query(type, field, val)
          })
      })
      .build();
  }
  /* agg is parent of query */
  if (!_.isEmpty(query.parent) && agg.type === query.parent) {
    /* build has_child query */
    return bodybuilder()
      .query('has_child', {type: `${query.type}`}, (q) => {
        return q
          .query(type, field, val)
      })
      .build();
  }
  /* agg & query is same generation */
  if (!_.isEmpty(query.type) && agg.type === query.type) {
    /* build normal query */
    /* agg type and query type dont match */
    if (aggGroup !== queryGroup) {
      return bodybuilder()
        .query('match_all', {})
        .build();
    }
    return bodybuilder()
      .query(type, field, val)
      .build();
  }
  /* agg is child of query */
  if (!_.isEmpty(query.child) && query.child.indexOf(agg.type) > -1) {
    /* build has_parent query */
    return bodybuilder()
      .query('has_parent', {type: `${agg.parent}`}, (q) => {
        return q
          .query(type, field, val)
      })
      .build();
  }
  /* agg is grand child of query */
  if (!_.isEmpty(query.grandChild) && query.grandChild.indexOf(agg.type) > -1) {
    /* build 2 has_parent query */
    return bodybuilder()
      .query('has_parent', {type: `${agg.parent}`}, (q) => {
        return q
          .query('has_parent', {type: `${agg.grandParent}`}, (q) => {
            return q
              .query(type, field, val)
          })
      })
      .build();
  }

  /* No relation match */
  throw new Meteor.Error('UNSUPPORTED_GENERATION', JSON.stringify({aggGroup, query}));
};

/**
 *
 * @param operator
 * @param fieldGroup
 * @param value
 */
const buildNormalQuery = ({operator, fieldGroup, value}) => {
};

/**
 *
 * @param type
 * @param aggGroup
 * @param operator
 * @param fieldGroup
 * @param value
 * @param queryType
 */
const buildQuery = (type, {aggGroup, operator, fieldGroup, value}, queryType = 'query') => {
  switch (type) {
    case 'normal':
    {
      return buildNormalQuery({operator, fieldGroup, value});
    }
    case 'nested':
    {
      return buildNestedQuery({operator, fieldGroup, value}, queryType);
    }
    case 'parentChild':
    {
      return buildParentChildQuery({aggGroup, operator, fieldGroup, value});
    }
    default:
    {
      throw new Meteor.Error('UNSUPPORTED_QUERY_TYPE', `Supporting normal | nested | parentChild only. ${type} is unsupported.`);
    }
  }
};

const buildAggregation = (agg) => {
  check(agg, Object);

  const {summaryType: type, group, field} = agg;

  /* validate aggs params */
  // summaryType
  if (['value_count', 'sum', 'avg', 'max', 'min'].indexOf(type) === -1) {
    return {error: `${type} unsupported.`};
  }
  let ESField = '';

  if (field === 'total') {
    ESField = Field()[group]().elastic().id;
  } else {
    ESField = Field()[group]().field()[field]().elastic().field;
  }

  return bodybuilder()
    .aggregation(type, ESField)
    .build();
};

const SingleQuery = () => ({
  buildQuery,
  buildAggregation,
  buildNormalQuery,
});

export default SingleQuery

/*
 * Test
 *

 const
 operator = 'greaterThan',
 field = {group: 'iCMLoan', name: 'totalPrincipalAmount'},
 value = [{type: 'string', value: 430}];
 const output = SingleQuery().generate({operator, fieldGroup: field, value});
 buildQuery(output);
 * */