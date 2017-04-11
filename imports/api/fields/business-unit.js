import Standard from './standard';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: business_units
 */


const BusinessUnit = () => ({
  props: () => ({
    id: 'BusinessUnit',
    name: 'Business unit',
    type: 'group'
  }),
  elastic: () => ({
    parent: 'customers',
    field: 'business_units',
  }),
  field: () => ({
    name: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'name',
          name: 'Name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'name',
        })
      }
    ),
    paymentDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'paymentDate',
          name: 'Payment date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'salary_payment_date',
        }),
      }
    ),
    numberCutOffTimes: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'numberCutOffTimes',
          name: 'Number cut off times',
          type: 'number'
        }),
        elastic: () => ({
          field: 'number_cut_off_times',
        }),
      }
    ),
    totalICMs: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'totalICMs',
          name: 'Total iCare members',
          type: 'number'
        }),
        elastic: () => ({
          field: 'total_icare_members',
        })
      }
    ),
  })
});

export default BusinessUnit