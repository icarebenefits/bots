import Standard from './standard';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMLoan = () => ({
  props: () => ({
    id: 'iCMLoan',
    name: 'iCare member loan',
    type: 'group'
  }),
  elastic: () => ({
    parent: 'business_units.icare_members',
    field: 'business_units.icare_members.loans',
  }),
  field: () => ({
    loanId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'loanId',
          name: 'Loan ID',
          type: 'string'
        }),
        elastic: () => ({
          field: 'loanId',
        })
      }
    ),
    orderId: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'orderId',
          name: 'Order ID',
          type: 'string'
        }),
        elastic: () => ({
          field: 'orderId',
        }),
      }
    ),
    overduePeriod: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'overduePeriod',
          name: 'Over due period',
          type: 'string'
        }),
        elastic: () => ({
          field: 'overduePeriod',
        }),
      }
    ),
    totalOverdueAmount: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'totalOverdueAmount',
          name: 'Total over due amount',
          type: 'number'
        }),
        elastic: () => ({
          field: 'totalOverdueAmount',
        })
      }
    ),
    totalPaidAmount: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'totalPaidAmount',
          name: 'Total paid amount',
          type: 'number'
        }),
        elastic: () => ({
          field: 'totalPaidAmount',
        })
      }
    ),
    totalPrincipalAmount: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'totalPrincipalAmount',
          name: 'totalPrincipalAmount',
          type: 'number'
        }),
        elastic: () => ({
          field: 'totalPrincipalAmount',
        })
      }
    ),
  })
});

export default iCMLoan