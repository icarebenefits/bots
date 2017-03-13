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

// date
const hireDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'hireDate',
      name: 'Hire date',
    }
  }
);
const birthday = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'birthday',
      name: 'Birthday',
    },
  },
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
  hireDate,
  birthday,
  iCareMember,
};

export default Fields