import StandardFields from '../standard/fields';

/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 */

// string
const name = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'name',
      name: 'Company Name',
      type: 'string',
      ESField: 'company_name',
    }
  }
);
const email = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'email',
      name: 'Email',
      type: 'string',
      ESField: 'email',
    }
  }
);
const phone = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'phone',
      name: 'Phone',
      type: 'string',
      ESField: 'phone',
    }
  }
);
const address = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'address',
      name: 'Address',
      type: 'string',
      ESField: 'address',
    }
  }
);
const repaymentMethod = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'repaymentMethod',
      name: 'Repayment Method',
      type: 'string',
      ESField: 'repayment_method',
    }
  }
);
const typeOfContract = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'typeOfContract',
      name: 'Type of Contract',
      type: 'string',
      ESField: 'type_of_contract',
    }
  }
);

// date
const contractStartDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'contractStartDate',
      name: 'Contract Start Date',
      type: 'date',
      ESField: 'contract_start_date',
    }
  }
);
const contractEndDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'contractEndDate',
      name: 'Contract End Date',
      type: 'date',
      ESField: 'contract_end_date',
    }
  }
);
// number
const numberOfEmployees = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'numberOfEmployees',
      name: 'Number of Employees',
      type: 'number',
      ESField: 'number_employees',
    },
  },
);


const Customer = {
  props: {
    id: 'Customer',
    name: 'Customer',
    type: 'group',
  },
  fields: {
    name,
    email,
    phone,
    address,
    repaymentMethod,
    typeOfContract,
    contractStartDate,
    contractEndDate,
    numberOfEmployees,
  }
};

export default Customer