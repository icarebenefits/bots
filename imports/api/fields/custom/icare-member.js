import StandardFields from '../standard/fields';

// string
const name = () => Object.assign(
  {},
  StandardFields.StringField(),
  {
    props: {
      id: 'name',
      name: 'Name',
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
      ESField: 'contract_type',
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
      ESField: 'bank_name',
    }
  }
);
const hasPurchased = () => Object.assign(
  {},
  StandardFields.BooleanField(),
  {
    props: {
      id: 'hasPurchased',
      name: 'Has Purchased',
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
      ESField: 'last_purchased',
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
      ESField: '',
    }
  }
);

const iCareMember = {
  props: {
    id: 'iCareMember',
    name: 'iCare Member',
  },
  fields: {
    hasPurchased, lastPurchasedDate,
    name, gender, socialId, dateOfBirth, phone, email, address,
    employeeId, jobTitle, department, salary, hiringDate, terminationDate,
    contractType, creditLimit, dueLimit, // availableCL, availableDL,
    maternityLeaveStartDate, maternityLeaveEndDate, salaryPaymentMethod, bankName,
    // soNumber, purchaseDate
  }
};

export default iCareMember