import StandardFields from '../standard/fields';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMDPD0 = {
  props: {
    id: 'iCMDPD10',
    name: 'iCare member DPD 10 days',
    type: 'group',
    elastic: {
      parent: 'icare_members'
    },
  },
  fields: {
    numberOfLoans: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'numberOfLoans',
          name: 'Number of loans',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'numberOfLoans',
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

export default iCMDPD0