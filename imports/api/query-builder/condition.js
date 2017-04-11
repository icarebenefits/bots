import {Field, Operator} from '/imports/api/fields';
// import buildQuery from './query-builder';

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

const Condition = () => ({
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
        field: `${field}.${name}`,
        parent: `${field}`,
        operator, value
      }, []);

    return output;
  },
});

export default Condition

/*
* Test
*

 const
 operator = 'greaterThan',
 field = {group: 'iCMLoan', name: 'totalPrincipalAmount'},
 value = [{type: 'string', value: 430}];
 const output = Condition().generate({operator, fieldGroup: field, value});
 buildQuery(output);
* */