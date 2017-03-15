import StandardFields from '../standard/fields';

/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 */

// string
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

// number
const iCareMember = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'iCareMember',
      name: 'iCare member',
    },
  },
);

// combinator

const Fields = {
  email,
  phone,
  alternatePhone,
  address,
  repaymentMechanism,
  typeOfContract,
  contractStartDate,
  contractEndDate,
};

export default Fields