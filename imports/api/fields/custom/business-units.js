import StandardFields from '../standard/fields';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: business_units
 */


const BusinessUnit = {
  props: {
    id: 'BusinessUnit',
    name: 'Business unit',
    type: 'group',
    elastic: {
      parent: 'customers',
      field: 'business_units',
    },
  },
  fields: {
    name: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'name',
          name: 'Name',
          type: 'string',
          elastic: {
            parent: 'customers',
            field: 'name',
          }
        }
      }
    ),
    paymentDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'paymentDate',
          name: 'Payment date',
          type: 'date',
          elastic: {
            parent: 'customers',
            field: 'salary_payment_date',
          },
        }
      }
    ),
    numberCutOffTimes: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'numberCutOffTimes',
          name: 'Number cut off times',
          type: 'number',
          elastic: {
            parent: 'customers',
            field: 'number_cut_off_times',
          },
        }
      }
    ),
    totalICMs: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'totalICMs',
          name: 'Total iCare members',
          type: 'number',
          elastic: {
            parent: 'customers',
            field: 'total_icare_members',
          }
        }
      }
    ),
  }
};

export default BusinessUnit