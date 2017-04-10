import StandardFields from '../standard/fields';

/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 */


const Customer = {
  props: {
    id: 'Customer',
    name: 'Customer',
    type: 'group',
    elastic: {
      parent: null
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
            parent: null,
            field: 'name',
          }
        }
      }
    ),
    umberOfEmployees: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'numberOfEmployees',
          name: 'Number of employees',
          type: 'number',
          elastic: {
            parent: null,
            field: 'number_employees',
          }
        },
      },
    ),
    numberOfICMs: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'numberOfICMs',
          name: 'number of iCare members',
          type: 'number',
          elastic: {
            parent: null,
            field: 'number_iCMs',
            type: 'script',  // script field, value is calculated when search
          },
        }
      }
    ),
    email: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'email',
          name: 'Email',
          type: 'string',
          elastic: {
            parent: null,
            field: 'email'
          },
        }
      }
    ),
    phone: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'phone',
          name: 'Phone',
          type: 'string',
          elastic: {
            parent: null,
            field: 'phone',
          }
        }
      }
    ),
    address: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'address',
          name: 'Address',
          type: 'string',
          elastic: {
            parent: null,
            field: 'address',
          }
        }
      }
    ),
    contractStartDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'contractStartDate',
          name: 'Contract start date',
          type: 'date',
          elastic: {
            parent: null,
            field: 'contract_start_date',
          },
        }
      }
    ),
    contractEndDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'contractEndDate',
          name: 'Contract end date',
          type: 'date',
          elastic: {
            parent: null,
            field: 'contract_end_date',
          },
        }
      }
    ),
    repaymentMethod: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'repaymentMethod',
          name: 'Repayment method',
          type: 'string',
          elastic: {
            parent: null,
            field: 'repayment_method',
          }
        }
      }
    ),
    typeOfContract: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'typeOfContract',
          name: 'Type of contract',
          type: 'string',
          elastic: {
            parent: null,
            field: 'type_of_contract',
          },
        }
      }
    ),
  }
};

export default Customer