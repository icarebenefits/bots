import StandardFields from '../standard/fields';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMTicket = {
  props: {
    id: 'iCMTicket',
    name: 'iCare member ticket',
    type: 'group',
    elastic: {
      parent: 'icare_members',
      field: 'tickets',
    },
  },
  fields: {
    ticketId: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'ticketId',
          name: 'Ticket ID',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'ticket_id',
          }
        }
      }
    ),
    title: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'title',
          name: 'Title',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'title',
          },
        }
      }
    ),
    description: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'description',
          name: 'Description',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'description',
          },
        }
      }
    ),
    status: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'status',
          name: 'Status',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'status',
          }
        }
      }
    ),
    priority: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'priority',
          name: 'Priority',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'priority',
          }
        }
      }
    ),
    staffName: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'staffName',
          name: 'Staff name',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'staff_name',
          }
        }
      }
    ),
    staffEmail: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'staffEmail',
          name: 'Staff email',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'staff_email',
          }
        }
      }
    ),
    createdDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'createdDate',
          name: 'Created date',
          type: 'date',
          elastic: {
            parent: 'icare_members',
            field: 'created_at',
          }
        }
      }
    ),
    modifiedDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'modifiedDate',
          name: 'Modified date',
          type: 'date',
          elastic: {
            parent: 'icare_members',
            field: 'modified_at',
          }
        }
      }
    ),
    resolvedDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'resolvedDate',
          name: 'Resolved date',
          type: 'date',
          elastic: {
            parent: 'icare_members',
            field: 'resolved_at',
          }
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
            parent: 'icare_members',
            field: 'department',
          }
        }
      }
    ),
    soNumber: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'soNumber',
          name: 'SO number',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'so_number',
          }
        }
      }
    ),
    numberMessages: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'numberMessages',
          name: 'Number of messages',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'number_messages',
          }
        }
      }
    ),
  }
};

export default iCMTicket