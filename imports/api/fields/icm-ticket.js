import Standard from './standard';
import {SUGGESTS} from './constants';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMTicket = () => ({
  props: () => ({
    id: 'iCMTicket',
    name: 'iCare member ticket',
    type: 'group'
  }),
  elastic: () => ({
    id: 'ticket_id',
    type: 'ticket',
    grandParent: 'customer',
    parent: 'icare_member',
  }),
  field: () => ({
    ticketId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketId',
          name: 'Ticket ID',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'ticket_id',
        })
      }
    ),
    ticketSONumber: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketSONumber',
          name: 'SO number',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'so_number',
        })
      }
    ),
    ticketTitle: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketTitle',
          name: 'title',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'title',
        })
      }
    ),
    ticketDescription: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketDescription',
          name: 'Description',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'description',
        })
      }
    ),
    ticketType: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketType',
          name: 'Type',
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.ticket.type
        }),
        elastic: () => ({
          field: 'ticket_type',
        })
      }
    ),
    ticketPriority: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketPriority',
          name: 'Priority',
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.ticket.priority
        }),
        elastic: () => ({
          field: 'priority',
        })
      }
    ),
    ticketStatus: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketStatus',
          name: 'Status',
          type: 'suggest',
          bucket: true,
          placeHolder: 'confirmed',
          suggests: SUGGESTS.ticket.status
        }),
        elastic: () => ({
          field: 'ticket_status',
        }),
      }
    ),
    ticketStaffName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketStaffName',
          name: 'Staff name',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'staff_name',
        }),
      }
    ),
    ticketStaffEmail: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketStaffEmail',
          name: 'Staff email',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'staff_email',
        }),
      }
    ),
    ticketNumberMessages: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'ticketNumberMessages',
          name: 'Number messages',
          type: 'number'
        }),
        elastic: () => ({
          field: 'number_messages',
        })
      }
    ),
    ticketDepartment: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'ticketDepartment',
          name: 'Department',
          type: 'string',
          bucket: true,
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'department',
        })
      }
    ),
    ticketCreatedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'ticketCreatedAt',
          name: 'Created at',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'created_at',
        })
      }
    ),
    ticketModifiedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'ticketModifiedAt',
          name: 'Modified at',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'modified_at',
        })
      }
    ),
    ticketResolvedAt: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'ticketResolvedAt',
          name: 'Resolved at',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'resolved_at',
        })
      }
    ),
  })
});

export default iCMTicket