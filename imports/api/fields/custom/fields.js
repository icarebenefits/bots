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
      name: 'Name',
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
    }
  }
);
const alternatePhone = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'alternatePhone',
      name: 'Alternate Phone',
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
    }
  }
);
const repaymentMechanism = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'repaymentMechanism',
      name: 'Repayment Mechanism',
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
    }
  }
);
const hireDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'hireDate',
      name: 'Hire Date',
    }
  }
);
const terminationDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'terminationDate',
      name: 'Termination Date',
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
    },
  },
);
const numberOfiCMs = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'numberOfiCMs',
      name: 'Number of iCMs',
    },
  },
);
const paymentDay = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'paymentDay',
      name: 'Payment Day',
    },
  },
);
const numberOfCutOffTimes = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'numberOfCutOffTimes',
      name: '# of cut-off times',
    },
  },
);

// Combo fields
const businessUnits = () => ({
  props: {
    id: 'businessUnits',
    name: 'Business Units',
  },
  fields: {
    name: Object.assign({}, name()),
    paymentDay: Object.assign({}, paymentDay()),
    numberOfCutOffTimes: Object.assign({}, numberOfCutOffTimes()),
  }
});

const Fields = {
  email,
  phone,
  alternatePhone,
  address,
  repaymentMechanism,
  typeOfContract,
  contractStartDate,
  contractEndDate,
  numberOfEmployees,
  numberOfiCMs,
  businessUnits,
};

export default Fields