import StandardFields from '../standard/fields';

const iCareMember = {
  props: {
    id: 'iCareMember',
    name: 'iCare Member',
    type: 'group',
    elastic: {
      parent: 'business_units'
    },
  },
  fields: {
    name: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'name',
          name: 'Name',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'name'
          },
        }
      }
    ),
    socialId: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'socialId',
          name: 'Social ID',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'social_id'
          },
        }
      }
    ),
    gender: () => Object.assign(
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
    ),
    dateOfBirth: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'dateOfBirth',
          name: 'Date of birth',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'date_of_birth'
          },
        }
      }
    ),
    phone: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'phone',
          name: 'Phone',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'phone'
          },
        }
      }
    ),
    email: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'email',
          name: 'Email',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'email'
          },
        }
      }
    ),
    address: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'address',
          name: 'Address',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'address'
          },
        }
      }
    ),
    employeeId: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'employeeId',
          name: 'Employee ID',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'employee_id'
          },
        }
      }
    ),
    jobTitle: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'jobTitle',
          name: 'Job title',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'job_title'
          },
        }
      }
    ),
    department: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'department',
          name: 'Department',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'department'
          },
        }
      }
    ),
    salary: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'salary',
          name: 'Salary',
          type: 'number',
          elastic: {
            parent: 'business_units',
            field: 'salary'
          },
        }
      }
    ),
    hiringDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'hiringDate',
          name: 'Hiring date',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'hiring_date'
          },
        }
      }
    ),
    terminationDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'terminationDate',
          name: 'Termination date',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'termination_date',
          },
        }
      }
    ),
    contractType: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'contractType',
          name: 'Contract type',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'contract_type'
          },
        }
      }
    ),
    inactivate: () => Object.assign(
      {},
      StandardFields.BoolField(),
      {
        props: {
          id: 'inactivate',
          name: 'Inactivate',
          type: 'bool',
          elastic: {
            parent: 'business_units',
            field: 'inactivate'
          },
        }
      }
    ),
    creditLimit: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'creditLimit',
          name: 'Credit limit',
          type: 'number',
          elastic: {
            parent: 'business_units',
            field: 'credit_limit'
          },
        }
      }
    ),
    dueLimit: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'dueLimit',
          name: 'Due limit',
          type: 'number',
          elastic: {
            parent: 'business_units',
            field: 'due_limit'
          },
        }
      }
    ),
    availableCL: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'availableCL',
          name: 'Available credit limit',
          type: 'number',
          elastic: {
            parent: 'business_units',
            field: 'available_credit_limit'
          },
        }
      }
    ),
    availableDL: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'availableDL',
          name: 'Available due limit',
          type: 'number',
          elastic: {
            parent: 'business_units',
            field: 'available due limit'
          },
        }
      }
    ),
    saving: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'saving',
          name: 'Saving',
          type: 'number',
          elastic: {
            parent: 'business_units',
            field: 'saving'
          },
        }
      }
    ),
    maternityLeaveStartDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'maternityLeaveStartDate',
          name: 'Maternity leave start date',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'maternity_leave_start_date'
          },
        }
      }
    ),
    maternityLeaveEndDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'maternityLeaveEndDate',
          name: 'Maternity leave end date',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'maternity_leave_end_date'
          },
        }
      }
    ),
    salaryPaymentMethod: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'salaryPaymentMethod',
          name: 'Salary payment method',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'salary_payment_method'
          },
        }
      }
    ),
    bankName: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'bankName',
          name: 'Bank name',
          type: 'string',
          elastic: {
            parent: 'business_units',
            field: 'bank_name'
          },
        }
      }
    ),
    hasPurchased: () => Object.assign(
      {},
      StandardFields.BoolField(),
      {
        props: {
          id: 'hasPurchased',
          name: 'Has purchased',
          type: 'bool',
          elastic: {
            parent: 'business_units',
            field: 'has_purchased'
          },
        }
      }
    ),
    lastPurchaseDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'lastPurchaseDate',
          name: 'Last purchase date',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'last_purchase_date'
          },
        }
      }
    ),
    createdAt: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'createdAt',
          name: 'Create Date',
          type: 'date',
          elastic: {
            parent: 'business_units',
            field: 'created_at'
          },
        }
      }
    ),
  }
};

export default iCareMember