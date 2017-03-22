import StandardFields from '../standard/fields';

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
const socialId = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'socialId',
      name: 'Social ID',
    }
  }
);
const gender = () => Object.assign(
  {},
  StandardFields.GenderField(),
  {
    props: {
      id: 'gender',
      name: 'Gender',
    }
  }
);
const dateOfBirth = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'dateOfBirth',
      name: 'Date of Birth',
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
const employeeId = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'employeeId',
      name: 'Employee ID',
    }
  }
);
const jobTitle = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'jobTitle',
      name: 'Job Title',
    }
  }
);
const department = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'department',
      name: 'Department',
    }
  }
);
const salary = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'salary',
      name: 'Salary',
    }
  }
);
const hiringDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'hiringDate',
      name: 'Hiring Date',
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
const contractType = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'contractType',
      name: 'Contract Type',
    }
  }
);
const inactivate = () => Object.assign(
  {},
  StandardFields.BooleanField(),
  {
    props: {
      id: 'inactivate',
      name: 'Inactivate',
    }
  }
);
const creditLimit = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'creditLimit',
      name: 'Credit Limit',
    }
  }
);
const dueLimit = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'dueLimit',
      name: 'Due Limit',
    }
  }
);
const availableCL = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'availableCL',
      name: 'Available Credit Limit',
    }
  }
);
const availableDL = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'availableDL',
      name: 'Available Due Limit',
    }
  }
);
const maternityLeaveStartDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'maternityLeaveStartDate',
      name: 'Maternity Leave Start Date',
    }
  }
);
const maternityLeaveEndDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'maternityLeaveEndDate',
      name: 'Maternity Leave End Date',
    }
  }
);
const salaryPaymentMethod = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'salaryPaymentMethod',
      name: 'Salary Payment Method',
    }
  }
);
const bankName = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'bankName',
      name: 'Bank Name',
    }
  }
);
const hasAnySO = () => Object.assign(
  {},
  StandardFields.BooleanField(),
  {
    props: {
      id: 'hasAnySO',
      name: 'Has Any SO',
    }
  }
);
const soNumber = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'soNumber',
      name: 'SO Number',
    }
  }
);
const purchaseDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'purchaseDate',
      name: 'Purchase Date',
    }
  }
);
// Combo fields
const SOs = () => ({
  props: {
    id: 'SOs',
    name: 'SO Fields...',
  },
  fields: {
    hasAnySO: Object.assign({}, hasAnySO()),
    soNumber: Object.assign({}, soNumber()),
    purchaseDate: Object.assign({}, purchaseDate()),
  }
});

const iCareMember = {
  props: {
    id: 'iCareMember',
    name: 'iCare Member',
  },
  fields: {
    name, socialId, dateOfBirth, phone, email, address,
    employeeId, jobTitle, department, salary, hiringDate, terminationDate,
    contractType, creditLimit, dueLimit, availableCL, availableDL,
    maternityLeaveStartDate, maternityLeaveEndDate, salaryPaymentMethod, bankName,
    SOs
  }
  // missing gender and boolean field
};

export default iCareMember