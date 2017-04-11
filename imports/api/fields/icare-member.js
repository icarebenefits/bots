import Standard from './standard';

const iCareMember = () => ({
  props: () => ({
    id: 'iCareMember',
    name: 'iCare Member',
    type: 'group'
  }),
  elastic: () => ({
    parent: 'business_units',
    field: 'business_units.icare_members',
  }),
  field: () => ({
    name: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'name',
          name: 'Name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'name'
        }),
      }
    ),
    socialId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'socialId',
          name: 'Social ID',
          type: 'string'
        }),
        elastic: () => ({
          field: 'social_id'
        }),
      }
    ),
    gender: () => Object.assign(
      {},
      Standard().Gender(),
      {
        props: () => ({
          id: 'gender',
          name: 'Gender',
          type: 'gender'
        }),
        elastic: () => ({
          field: 'gender',
        })
      }
    ),
    dateOfBirth: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'dateOfBirth',
          name: 'Date of birth',
          type: 'date'
        }),
        elastic: () => ({
          field: 'date_of_birth'
        }),
      }
    ),
    phone: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'phone',
          name: 'Phone',
          type: 'string'
        }),
        elastic: () => ({
          field: 'phone'
        }),
      }
    ),
    email: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'email',
          name: 'Email',
          type: 'string'
        }),
        elastic: () => ({
          field: 'email'
        }),
      }
    ),
    address: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'address',
          name: 'Address',
          type: 'string'
        }),
        elastic: () => ({
          field: 'address'
        }),
      }
    ),
    employeeId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'employeeId',
          name: 'Employee ID',
          type: 'string'
        }),
        elastic: () => ({
          field: 'employee_id'
        }),
      }
    ),
    jobTitle: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'jobTitle',
          name: 'Job title',
          type: 'string'
        }),
        elastic: () => ({
          field: 'job_title'
        }),
      }
    ),
    department: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'department',
          name: 'Department',
          type: 'string'
        }),
        elastic: () => ({
          field: 'department'
        }),
      }
    ),
    salary: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'salary',
          name: 'Salary',
          type: 'number'
        }),
        elastic: () => ({
          field: 'salary'
        }),
      }
    ),
    hiringDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'hiringDate',
          name: 'Hiring date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'hiring_date'
        }),
      }
    ),
    terminationDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'terminationDate',
          name: 'Termination date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'termination_date',
        }),
      }
    ),
    contractType: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'contractType',
          name: 'Contract type',
          type: 'string'
        }),
        elastic: () => ({
          field: 'contract_type'
        }),
      }
    ),
    inactivate: () => Object.assign(
      {},
      Standard().Bool(),
      {
        props: () => ({
          id: 'inactivate',
          name: 'Inactivate',
          type: 'bool'
        }),
        elastic: () => ({
          field: 'inactivate'
        }),
      }
    ),
    creditLimit: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'creditLimit',
          name: 'Credit limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'credit_limit'
        }),
      }
    ),
    dueLimit: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'dueLimit',
          name: 'Due limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'due_limit'
        }),
      }
    ),
    availableCL: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'availableCL',
          name: 'Available credit limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'available_credit_limit'
        }),
      }
    ),
    availableDL: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'availableDL',
          name: 'Available due limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'available due limit'
        }),
      }
    ),
    saving: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'saving',
          name: 'Saving',
          type: 'number'
        }),
        elastic: () => ({
          field: 'saving'
        }),
      }
    ),
    maternityLeaveStartDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'maternityLeaveStartDate',
          name: 'Maternity leave start date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'maternity_leave_start_date'
        }),
      }
    ),
    maternityLeaveEndDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'maternityLeaveEndDate',
          name: 'Maternity leave end date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'maternity_leave_end_date'
        }),
      }
    ),
    salaryPaymentMethod: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'salaryPaymentMethod',
          name: 'Salary payment method',
          type: 'string'
        }),
        elastic: () => ({
          field: 'salary_payment_method'
        }),
      }
    ),
    bankName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'bankName',
          name: 'Bank name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'bank_name'
        }),
      }
    ),
    hasPurchased: () => Object.assign(
      {},
      Standard().Bool(),
      {
        props: () => ({
          id: 'hasPurchased',
          name: 'Has purchased',
          type: 'bool'
        }),
        elastic: () => ({
          field: 'has_purchased'
        }),
      }
    ),
    lastPurchaseDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'lastPurchaseDate',
          name: 'Last purchase date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'last_purchase_date'
        }),
      }
    ),
    createdAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'createdAt',
          name: 'Create Date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'created_at'
        }),
      }
    ),
  })
});

export default iCareMember