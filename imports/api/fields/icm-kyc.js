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
          placeHolder: ''
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
          type: 'date'
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
          suggests: SUGGESTS.kyc.approvedOrRejectedByUserRole
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
          suggests: SUGGESTS.kyc.assignedToUserRole
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