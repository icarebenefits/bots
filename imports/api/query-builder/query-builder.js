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

const buildQuery = (cond) => {
  const customers = buildTree(cond, null).child;
  
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
  return body;
};

export default buildQuery



