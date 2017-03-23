import StandardFields from '../standard/fields';

// string
const name = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'name',
      name: 'Name',
      type: 'string',
      ESField: 'full_name',
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
      type: 'string',
      ESField: 'social_id',
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
      type: 'gender',
      ESField: 'gender',
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
      type: 'date',
      ESField: 'date_of_birth',
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
      ESField: 'telephone',
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
const employeeId = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'employeeId',
      name: 'Employee ID',
      type: 'string',
      ESField: 'employee_id',
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
      type: 'string',
      ESField: 'job_title',
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
      type: 'string',
      ESField: 'department',
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
      type: 'number',
      ESField: 'salary',
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
      type: 'date',
      ESField: 'hiring_date',
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
      type: 'date',
      ESField: 'termination_date',
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
      type: 'string',
      ESField: 'contract_type',
    }
  }
);
const inactivate = () => Object.assign(
  {},
  StandardFields.BoolField(),
  {
    props: {
      id: 'inactivate',
      name: 'Inactivate',
      type: 'bool',
      ESField: 'is_active',
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
      type: 'number',
      ESField: 'credit_limit',
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
      type: 'number',
      ESField: 'due_limit',
    }
  }
);
// not active
const availableCL = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'availableCL',
      name: 'Available Credit Limit',
      type: 'number',
      ESField: '',
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
      type: 'number',
      ESField: '',
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
      type: 'date',
      ESField: 'maternity_start_date',
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
      type: 'date',
      ESField: 'maternity_end_date',
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
      type: 'string',
      ESField: 'salary_payment_method',
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
      type: 'string',
      ESField: 'bank_name',
    }
  }
);
const hasPurchased = () => Object.assign(
  {},
  StandardFields.BoolField(),
  {
    props: {
      id: 'hasPurchased',
      name: 'Has Purchased',
      type: 'bool',
      ESField: 'has_purchased',
    }
  }
);
const lastPurchasedDate = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'lastPurchasedDate',
      name: 'Last Purchased Date',
      type: 'date',
      ESField: 'last_purchased',
    }
  }
);
const hasAnySO = () => Object.assign(
  {},
  StandardFields.BoolField(),
  {
    props: {
      id: 'hasAnySO',
      name: 'Has Any SO',
      type: 'bool',
      ESField: '',
    }
  }
);
const soNumber = () => Object.assign(
  {},
  StandardFields.NumberField(),
  {
    props: {
      id: 'soNumber',
      name: 'SO Number',
      type: 'number',
      ESField: '',
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
      type: 'date',
      ESField: '',
    }
  }
);
const createdAt = () => Object.assign(
  {},
  StandardFields.DateField(),
  {
    props: {
      id: 'createdAt',
      name: 'Create Date',
      type: 'date',
      ESField: 'created_at',
    }
  }
);

const iCareMember = {
  props: {
    id: 'iCareMember',
    name: 'iCare Member',
    type: 'group',
  },
  fields: {
    hasPurchased, lastPurchasedDate,
    name, gender, socialId, dateOfBirth, phone, email, address,
    employeeId, jobTitle, department, salary, hiringDate, terminationDate,
    contractType, creditLimit, dueLimit, // availableCL, availableDL,
    maternityLeaveStartDate, maternityLeaveEndDate, salaryPaymentMethod, bankName,
    // soNumber, purchaseDate
    createdAt,
  }
};

export default iCareMember