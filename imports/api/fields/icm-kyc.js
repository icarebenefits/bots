import Standard from './standard';
import {SUGGESTS} from './constants';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: KYC
 */

const iCM_KYC = () => ({
  props: () => ({
    id: 'iCM_KYC',
    name: 'iCare member KYC',
    type: 'group'
  }),
  elastic: () => ({
    id: 'id',
    type: 'kyc',
    grandParent: 'customer',
    parent: 'icare_member',
  }),
  field: () => ({
    kycId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycId',
          name: 'KYC ID',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'id',
        })
      }
    ),
    kycFullName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'fullName',
          name: 'Full name',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'full_name',
        })
      }
    ),
    kycGender: () => Object.assign(
      {},
      Standard().Gender(),
      {
        props: () => ({
          id: 'kycGender',
          name: 'Gender',
          type: 'gender',
          bucket: true
        }),
        elastic: () => ({
          field: 'gender',
        })
      }
    ),
    kycBirthDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycBirthDate',
          name: 'Birth date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'birth_date',
        })
      }
    ),
    kycSocialId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycSocialId',
          name: 'Social Id',
          type: 'string',
          placeHolder: '',
          suggests: SUGGESTS.ticket.priority
        }),
        elastic: () => ({
          field: 'priority',
        })
      }
    ),
    kycPhone: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycPhone',
          name: 'Phone',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'phone'
        }),
      }
    ),
    kycHomePhone: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycHomePhone',
          name: 'Home phone',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'home_phone'
        }),
      }
    ),
    kycJobTitle: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycJobTitle',
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
    kycDepartment: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycDepartment',
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
    kycHiringDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycHiringDate',
          name: 'Hiring date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'hiring_date'
        }),
      }
    ),
    kycSalary: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'kycSalary',
          name: 'Salary',
          type: 'number'
        }),
        elastic: () => ({
          field: 'salary'
        }),
      }
    ),
    kycIssuanceDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycIssuanceDate',
          name: 'Issuance date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'issuance_date'
        }),
      }
    ),
    kycIssuancePlace: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycIssuancePlace',
          name: 'Issuance place',
          type: 'string',
          placeHolder: '',
          suggests: []
        }),
        elastic: () => ({
          field: 'issuance_place'
        }),
      }
    ),
    kycNationality: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycNationality',
          name: 'Nationality',
          type: 'suggest',
          placeHolder: '',
          suggests: SUGGESTS.kyc.nationality,
          bucket: true
        }),
        elastic: () => ({
          field: 'nationality'
        }),
      }
    ),
    kycBankAccountNumber: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycBankAccountNumber',
          name: 'Bank account number',
          type: 'string',
          placeHolder: '',
          suggests: []
        }),
        elastic: () => ({
          field: 'bank_account_number'
        }),
      }
    ),
    kycBankName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycBankName',
          name: 'Bank name',
          type: 'string',
          placeHolder: '',
          suggests: []
        }),
        elastic: () => ({
          field: 'bank_name'
        }),
      }
    ),
    kycEmail: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycEmail',
          name: 'Email',
          type: 'string',
          placeHolder: '',
          bucket: true
        }),
        elastic: () => ({
          field: 'email'
        }),
      }
    ),
    kycCreatedBy: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycCreatedBy',
          name: 'Created by Id',
          type: 'string'
        }),
        elastic: () => ({
          field: 'created_by'
        }),
      }
    ),
    kycCreatedByFullName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycCreatedByFullName',
          name: 'Created by full name',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'created_by_full_name'
        }),
      }
    ),
    kycCreatedByUserName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycCreatedByUserName',
          name: 'Created by user name',
          type: 'string',
          placeHolder: '',
          bucket: true
        }),
        elastic: () => ({
          field: 'created_by_user_name'
        }),
      }
    ),
    kycCreatedByUserRole: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycCreatedByUserRole',
          name: 'Created by user role',
          type: 'suggest',
          placeHolder: '',
          suggests: SUGGESTS.kyc.createdByUserRole,
          bucket: true
        }),
        elastic: () => ({
          field: 'created_by_user_role'
        }),
      }
    ),
    kycCreatedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycCreatedAt',
          name: 'Create date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'created_at'
        }),
      }
    ),
    kycModifiedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycModifiedAt',
          name: 'Modified date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'modified_at'
        }),
      }
    ),
    kycStatus: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycStatus',
          name: 'Status',
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.kyc.status
        }),
        elastic: () => ({
          field: 'state',
        }),
      }
    ),
    kycApprovedOrRejectedBy: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycApprovedOrRejectedBy',
          name: 'Approved or Rejected by Id',
          type: 'string'
        }),
        elastic: () => ({
          field: 'approved_or_rejected_by'
        }),
      }
    ),
    kycApprovedOrRejectedByFullName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycApprovedOrRejectedByFullName',
          name: 'Approved or Rejected by full name',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'approved_or_rejected_by_full_name'
        }),
      }
    ),
    kycApprovedOrRejectedByUserName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycApprovedOrRejectedByUserName',
          name: 'Approved or Rejected by user name',
          type: 'string',
          placeHolder: '',
          bucket: true
        }),
        elastic: () => ({
          field: 'approved_or_rejected_by_user_name'
        }),
      }
    ),
    kycApprovedOrRejectedByUserRole: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycApprovedOrRejectedByUserRole',
          name: 'Approved or Rejected by user role',
          type: 'suggest',
          placeHolder: '',
          suggests: SUGGESTS.kyc.approvedOrRejectedByUserRole,
          bucket: true
        }),
        elastic: () => ({
          field: 'approved_or_rejected_by_user_role'
        }),
      }
    ),
    kycApprovedOrRejectedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycApprovedOrRejectedAt',
          name: 'Approved or Rejected date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'approved_or_rejected_at'
        }),
      }
    ),
    kycAssignedTo: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycAssignedTo',
          name: 'Assigned to user Id',
          type: 'string'
        }),
        elastic: () => ({
          field: 'assigned_to'
        }),
      }
    ),
    kycAssignedToFullName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycAssignedToFullName',
          name: 'Assigned to full name',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'assigned_to_full_name'
        }),
      }
    ),
    kycAssignedToUserName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycAssignedToUserName',
          name: 'Assigned to user name',
          type: 'string',
          placeHolder: '',
          bucket: true
        }),
        elastic: () => ({
          field: 'assigned_to_user_name'
        }),
      }
    ),
    kycAssignedToUserRole: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'kycAssignedToUserRole',
          name: 'Assigned to user role',
          type: 'suggest',
          placeHolder: '',
          suggests: SUGGESTS.kyc.assignedToUserRole,
          bucket: true
        }),
        elastic: () => ({
          field: 'assigned_to_user_role'
        }),
      }
    ),
    kycLastResubmittedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'kycLastResubmittedAt',
          name: 'Last Resubmitted date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'last_resubmitted_at'
        }),
      }
    )
  })
});

export default iCM_KYC