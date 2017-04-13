import Standard from './standard';

const iCareMember = () => ({
  props: () => ({
    id: 'iCareMember',
    name: 'iCare Member',
    type: 'group'
  }),
  elastic: () => ({
    parent: 'customer',
    child: ['sales_order', 'loan'],
  }),
  field: () => ({
    icmName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmName',
          name: 'Name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'name'
        }),
      }
    ),
    icmSocialId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmSocialId',
          name: 'Social ID',
          type: 'string'
        }),
        elastic: () => ({
          field: 'social_id'
        }),
      }
    ),
    icmGender: () => Object.assign(
      {},
      Standard().Gender(),
      {
        props: () => ({
          id: 'icmGender',
          name: 'Gender',
          type: 'gender'
        }),
        elastic: () => ({
          field: 'gender',
        })
      }
    ),
    icmDateOfBirth: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmDateOfBirth',
          name: 'Date of birth',
          type: 'date'
        }),
        elastic: () => ({
          field: 'date_of_birth'
        }),
      }
    ),
    icmPhone: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmPhone',
          name: 'Phone',
          type: 'string'
        }),
        elastic: () => ({
          field: 'phone'
        }),
      }
    ),
    icmEmail: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmEmail',
          name: 'Email',
          type: 'string'
        }),
        elastic: () => ({
          field: 'email'
        }),
      }
    ),
    icmAddress: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmAddress',
          name: 'Address',
          type: 'string'
        }),
        elastic: () => ({
          field: 'address'
        }),
      }
    ),
    icmEmployeeId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmEmployeeId',
          name: 'Employee ID',
          type: 'string'
        }),
        elastic: () => ({
          field: 'employee_id'
        }),
      }
    ),
    icmJobTitle: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmJobTitle',
          name: 'Job title',
          type: 'string'
        }),
        elastic: () => ({
          field: 'job_title'
        }),
      }
    ),
    icmDepartment: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmDepartment',
          name: 'Department',
          type: 'string'
        }),
        elastic: () => ({
          field: 'department'
        }),
      }
    ),
    icmSalary: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmSalary',
          name: 'Salary',
          type: 'number'
        }),
        elastic: () => ({
          field: 'salary'
        }),
      }
    ),
    icmHiringDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmHiringDate',
          name: 'Hiring date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'hiring_date'
        }),
      }
    ),
    icmTerminationDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmTerminationDate',
          name: 'Termination date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'termination_date',
        }),
      }
    ),
    icmContractType: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmContractType',
          name: 'Contract type',
          type: 'string'
        }),
        elastic: () => ({
          field: 'contract_type'
        }),
      }
    ),
    icmInactivate: () => Object.assign(
      {},
      Standard().Bool(),
      {
        props: () => ({
          id: 'icmInactivate',
          name: 'Inactivate',
          type: 'bool'
        }),
        elastic: () => ({
          field: 'inactivate'
        }),
      }
    ),
    icmCreditLimit: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmCreditLimit',
          name: 'Credit limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'credit_limit'
        }),
      }
    ),
    icmDueLimit: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmDueLimit',
          name: 'Due limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'due_limit'
        }),
      }
    ),
    icmAvailableCL: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmAvailableCL',
          name: 'Available credit limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'available_credit_limit'
        }),
      }
    ),
    icmAvailableDL: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmAvailableDL',
          name: 'Available due limit',
          type: 'number'
        }),
        elastic: () => ({
          field: 'available_due_limit'
        }),
      }
    ),
    icmSaving: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmSaving',
          name: 'Saving',
          type: 'number'
        }),
        elastic: () => ({
          field: 'saving'
        }),
      }
    ),
    icmMaternityLeaveStartDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmMaternityLeaveStartDate',
          name: 'Maternity leave start date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'maternity_leave_start_date'
        }),
      }
    ),
    icmMaternityLeaveEndDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmMaternityLeaveEndDate',
          name: 'Maternity leave end date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'maternity_leave_end_date'
        }),
      }
    ),
    icmSalaryPaymentMethod: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmSalaryPaymentMethod',
          name: 'Salary payment method',
          type: 'string'
        }),
        elastic: () => ({
          field: 'salary_payment_method'
        }),
      }
    ),
    icmBankName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmBankName',
          name: 'Bank name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'bank_name'
        }),
      }
    ),
    icmHasPurchased: () => Object.assign(
      {},
      Standard().Bool(),
      {
        props: () => ({
          id: 'icmHasPurchased',
          name: 'Has purchased',
          type: 'bool'
        }),
        elastic: () => ({
          field: 'has_purchased'
        }),
      }
    ),
    icmLastPurchaseDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmLastPurchaseDate',
          name: 'Last purchase date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'last_purchase_date'
        }),
      }
    ),
    icmCreatedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'icmCreatedAt',
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