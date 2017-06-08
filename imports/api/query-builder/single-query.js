import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import bodybuilder from 'bodybuilder';
import _ from 'lodash';

import {Field, Operator, getESField} from '/imports/api/fields';

/* CONSTANTS */
import {AGGS_OPTIONS} from '/imports/ui/store/constants';

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
  const {parent,} = Field()[group]().elastic();

  const input = createInput({
    field: parent ? `${group}.${name}` : name,
    parent: `${group}`,
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
/*
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
 */
const buildNestedQuery = ({operator, fieldGroup, value}) => {
  const {group: queryGroup, elastic: {field: name, path}} = fieldGroup;
  const {type, field, value: val} = Operator()[operator]().getParams(name, value);

  return bodybuilder()
    .query('nested', 'path', path, (q) => {
      return q.query(type, field, val);
    })
    .build();
};

/**
 * build query base on relation between aggGroup and queryGroup
 * @param aggGroup - (grandParent, parent, type, child, grandChild)
 * @param queryGroup - (grandParent, parent, type, child, grandChild)
 */
const buildParentChildQuery = ({aggGroup, operator, fieldGroup, value}) => {
  const {group: queryGroup, elastic: {field: name}} = fieldGroup;
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
  if (!_.isEmpty(query.type) && agg.parent === query.parent) {
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
const buildNormalQuery = () => {
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
      return buildNestedQuery({operator, fieldGroup, value});
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

const buildAggregation = (useBucket, bucket, agg) => {
  check(agg, Object);

  const {summaryType, group, field, bucket: applyBucket = false} = agg;

  /* validate aggs params */
  // summaryType
  const allowedAggs = AGGS_OPTIONS.map(o => o.name);
  if (allowedAggs.indexOf(summaryType) === -1) {
    throw new Meteor.Error('BUILD_AGGREGATION', `${summaryType} unsupported.`);
  }

  let body = bodybuilder();
  try {
    const ESField = getESField(summaryType, group, field);

    if (useBucket && applyBucket) { // bucket is applied to SLA with this aggregation
      const {type, group, field, options} = bucket;
      if (_.isEmpty(type) || _.isEmpty(group) || _.isEmpty(field)) {
        throw new Meteor.Error('buildAggregation', `Bucket is missing data.`);
      }
      let bucketField = getESField('', group, field);
      switch (type) {
        case 'terms':
        {
          const {terms: aggOptions, size} = Meteor.settings.public.elastic.aggregation.bucket;
          const {orderBy, orderIn = 'desc'} = options;
          if (!_.isEmpty(orderBy)) {
            if (orderBy === field) {
              aggOptions.order = {"_term": orderIn};
            } else {
              aggOptions.order = {[`agg_${summaryType}_${ESField}`]: orderIn};
            }
          }
          body = body
            .aggregation(type, `${bucketField}.keyword`, {...aggOptions}, a => {
              return a.aggregation(summaryType, ESField)
            });
          break;
        }
        case 'date_histogram':
        {
          const {orderBy, orderIn = 'desc', interval} = options;
          const aggOptions = {interval};
          if (!_.isEmpty(orderBy)) {
            if (orderBy === field) {
              aggOptions.order = {"_key": orderIn};
            } else {
              aggOptions.order = {[`agg_${summaryType}_${ESField}`]: orderIn};
            }
          }
          body = body
            .aggregation(type, bucketField, {...aggOptions}, a => {
              return a.aggregation(summaryType, ESField)
            });
          break;
        }
        default:
          body = body
            .aggregation(type, bucketField, a => {
              return a.aggregation(summaryType, ESField)
            });
      }
    } else {
      body = body.aggregation(summaryType, ESField);
    }
  } catch (err) {
    throw new Meteor.Error('buildAggregation', err.message);
  }

  return body.build();
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