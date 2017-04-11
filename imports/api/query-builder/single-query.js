import {Field, Operator} from '/imports/api/fields';
import bodybuilder from 'bodybuilder';
import _ from 'lodash';


const buildNested = (tree) => {
  let nest = () => {
  };
  const {child} = tree;
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

const nested = (object, queryType = 'query') => {
  const {type, field} = object;
  let nest = () => {
  };
  if (!_.isEmpty(object.child)) {
    if(queryType === 'agg') {
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
    if(queryType === 'agg') {
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

const build = (cond, queryType = 'query') => {
  const customers = buildTree(cond, null).child;

  const {type, field} = customers;
  let body = bodybuilder();
  if(type === 'nested') {
    const {nest} = nested(customers.child, queryType);
    if(queryType === 'agg') {
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
    if(queryType === 'agg') {
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

const getParentGroup = (field) => {
  switch (field) {
    case 'business_units.icare_members.loans': {
      return 'iCareMember';
    }
    case 'business_units.icare_members': {
      return 'BusinessUnit';
    }
    case 'business_units': {
      return 'Customer';
    }
    case 'customers': {
      return null;
    }
  }
};

const createOutput = ({field, parent, operator, value}, output) => {
  if(operator) {
    // get params
    const params = Operator()[operator]().getParams(field, value);
    output.push({...params, parent});
    const group = getParentGroup(parent);
    if(group) {
      const {field: f} = Field()[group]().elastic();
      createOutput({field: parent, parent: f}, output);
    } else {
      createOutput({field: parent, parent: null}, output);
    }
  } else {
    if(parent) {
      output.push({field, parent});
      const group = getParentGroup(parent);
      if(group) {
        const {field: f} = Field()[group]().elastic();
        createOutput({field: parent, parent: f}, output);
      } else {
        createOutput({field: parent, parent: null}, output);
      }
    } else {
      output.push({field, parent});
    }
  }

  return output;
};

const SingleQuery = () => ({
  generate: ({operator, fieldGroup, value}) => {
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
    const {field, parent} = Field()[group]().elastic();

    const output = createOutput({
        field: parent ? `${field}.${name}` : name,
        parent: `${field}`,
        operator, value
      }, []);

    return output;
  },
  build,
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