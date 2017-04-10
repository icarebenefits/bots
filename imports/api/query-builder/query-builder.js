import bodybuilder from 'bodybuilder';
import _ from 'lodash';

const buildNested = (tree) => {
  let nest = () => {
  };
  const {child} = tree;
  console.log('child', JSON.stringify(child));
  if (child)
  // call buildNested with child data
    child.value = (q) => {
      return q
        .query(type, field, buildNested(child))
    };
  else {
    const {type, field, value} = tree;
    nest = (q) => {
      return q
        .query(type, field, value);
    }
    return nest;
  }
}

const buildQuery = () => {

  // implement the transformation from condition to below format
  // todo

  const cond1 = [
    {
      field: 'business_units.icare_members.loans.totalPrincipalAmount',
      parent: 'business_units.icare_members.loans',
      type: 'range',
      value: {gte: 430}
    },
    {field: 'business_units.icare_members.loans', parent: 'business_units.icare_members'},
    {field: 'business_units.icare_members', parent: 'business_units'},
    {field: 'business_units', parent: 'customers',},
    {field: 'customers', parent: null},
  ];

  const cond2 = [
    {field: 'name', type: 'wildcard', value: '*KE*', parent: 'customers'},
    {field: 'customers', parent: null}
  ];

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

  const customers = buildTree(cond2, null).child;
  console.log('customers', customers);
  /*
  const customers = {
    type: 'nested',
    field: {path: 'business_units'},
    child: {
      type: 'nested',
      field: {path: 'business_units.icare_members'},
      child: {
        type: 'nested',
        field: {path: 'business_units.icare_members.loans'},
        child: {
          type: 'range',
          field: 'business_units.icare_members.loans.amount',
          value: 430
        }
      }
    }
  };
  */

  const nested = (object) => {
    const {type, field} = object;
    let nest = () => {
    };
    if (!_.isEmpty(object.child)) {
      nest = (q) => {
        return q
          .query(type, field, nested(object.child).nest);
      };
    } else {
      const {value} = object;
      nest = (q) => {
        return q
          .query(type, field, value)
      };
    }

    return {nest};
  };

  const {type, field} = customers;
  let body = bodybuilder();
  if(type === 'nested') {
    const {nest} = nested(customers.child);
    body = body
        .query(type, field, nest)
        .build()
      ;
  } else {
    const {value} = customers;
    body = body
      .query(type, field, value)
      .build()
  }

  console.log('body', JSON.stringify(body));
};

export default buildQuery



