import StandardFields from '../standard/fields';

/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 */

// string
const Email = () => ({
  id: 'Email',
  description: 'Email',
  active: true,
  operators: Object.assign({}, StandardFields.StringField().operators),
  getType: () => {return StandardFields.StringField().id}
});

// date
const HireDate = () => ({
  id: 'HireDate',
  description: 'Hire date',
  active: true,
  operators: Object.assign({}, StandardFields.DateField().operators),
  getType: () => {return StandardFields.DateField().id}
});
const BirthDay = () => ({
  id: 'BirthDay',
  description: 'Day of birth',
  active: false,
  operators: Object.assign({}, StandardFields.DateField().operators),
  getType: () => {return StandardFields.DateField().id}
});

// number
const iCareMember = () => ({
  id: 'iCareMember',
  description: 'iCare member',
  active: true,
  operators: Object.assign({}, StandardFields.NumberField().operators),
  getType: () => {return StandardFields.NumberField().id}
});

// combinator

const Fields = {
  Email,
  HireDate,
  BirthDay,
  iCareMember,
};

export default Fields