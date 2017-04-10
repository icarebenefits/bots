import StandardFields from '../standard/fields';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMLoan = {
  props: {
    id: 'iCMLoan',
    name: 'iCare member loan',
    type: 'group',
    elastic: {
      parent: 'icare_members'
    },
  },
  fields: {
    loanId: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'loanId',
          name: 'Loan ID',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'loanId',
          }
        }
      }
    ),
    orderId: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'orderId',
          name: 'Order ID',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'orderId',
          },
        }
      }
    ),
    overduePeriod: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'overduePeriod',
          name: 'Over due period',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'overduePeriod',
          },
        }
      }
    ),
    totalOverdueAmount: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'totalOverdueAmount',
          name: 'Total over due amount',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'totalOverdueAmount',
          }
        }
      }
    ),
    totalPaidAmount: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'totalPaidAmount',
          name: 'Total paid amount',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'totalPaidAmount',
          }
        }
      }
    ),
    totalPrincipalAmount: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'totalPrincipalAmount',
          name: 'totalPrincipalAmount',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'totalPrincipalAmount',
          }
        }
      }
    ),
  }
};

export default iCMLoan