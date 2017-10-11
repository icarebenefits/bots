import Standard from './standard';
import {SUGGESTS} from './constants';

const iCareMember = () => ({
  props: () => ({
    id: 'iCareMember',
    name: 'iCare Member',
    type: 'group'
  }),
  elastic: () => ({
    id: 'magento_customer_id',
    parent: 'customer',
    type: 'icare_member',
    child: ['sales_order', 'loan', 'ticket'],
  }),
  field: () => ({
    icmName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmName',
          name: 'Name',
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: ''
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
          type: 'gender',
          bucket: true
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
          type: 'date',
          bucket: true
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
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: '',
          suggests: []
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
          type: 'string',
          placeHolder: '',
          suggests: []
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
          type: 'date',
          bucket: true
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
          type: 'date',
          bucket: true
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
          type: 'string',
          placeHolder: '',
          suggests: []
        }),
        elastic: () => ({
          field: 'contract_type'
        }),
      }
    ),
    icmStatus: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmStatus',
          name: 'Status',
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.iCareMember.status
        }),
        elastic: () => ({
          field: 'status'
        }),
      }
    ),
    icmAppActivated: () => Object.assign(
      {},
      Standard().Bool(),
      {
        props: () => ({
          id: 'icmAppActivated',
          name: 'iCM App Activated',
          type: 'bool'
        }),
        elastic: () => ({
          field: 'icm_app_activated'
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
          type: 'date',
          bucket: true
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
          type: 'date',
          bucket: true
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
          type: 'string',
          placeHolder: '',
          suggests: []
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
          type: 'string',
          bucket: true,
          placeHolder: '',
          suggests: []
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
          name: 'Create date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'created_at'
        }),
      }
    ),
    icmSegment: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'icmSegment',
          name: 'RFM Segment',
          type: 'suggest',
          bucket: true,
          placeHolder: 'Champion',
          suggests: SUGGESTS.iCareMember.RFMSegment
        }),
        elastic: () => ({
          field: 'rfm.segment'
        }),
      }
    ),
    icmRecency: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmRecency',
          name: 'RFM Recency',
          type: 'number'
        }),
        elastic: () => ({
          field: 'rfm.recency'
        }),
      }
    ),
    icmFrequency: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmFrequency',
          name: 'RFM Frequency',
          type: 'number'
        }),
        elastic: () => ({
          field: 'rfm.frequency'
        }),
      }
    ),
    icmMonetary: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'icmMonetary',
          name: 'RFM Monetary',
          type: 'number'
        }),
        elastic: () => ({
          field: 'rfm.monetary'
        }),
      }
    ),
  })
});

export default iCareMember