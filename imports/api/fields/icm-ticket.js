import Standard from './standard';
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'string'
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
          type: 'date'
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
          type: 'date'
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
          type: 'date'
        }),
        elastic: () => ({
          field: 'resolved_at',
        })
      }
    ),
  })
});

export default iCMTicket