import Standard from './standard';

/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 */
const Customer = () => ({
  props: () => ({
    id: 'Customer',
    name: 'Customer',
    type: 'group'
  }),
  elastic: () => ({
    id: 'netsuite_customer_id',
    type: 'customer',
    child: ['icare_member'],
    grandChild: ['sales_order', 'loan', 'ticket'],
  }),
  field: () => ({
    name: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'name',
          name: 'Name',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'name'
        })
      }
    ),
    numberEmployees: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'numberEmployees',
          name: 'Number of employees',
          type: 'number',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'number_employees',
        })
      },
    ),
    numberICMs: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'numberICMs',
          name: 'Number of iCare members',
          type: 'number',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'number_iCMs'
        }),
      }
    ),
    email: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'email',
          name: 'Email',
          type: 'string',
          placeHolder: 'icare.bots@icarebenefits.com'
        }),
        elastic: () => ({
          field: 'email'
        }),
      }
    ),
    phone: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'phone',
          name: 'Phone',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'phone',
        })
      }
    ),
    address: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'address',
          name: 'Address',
          type: 'string',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'address',
        })
      }
    ),
    contractStartDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'contractStartDate',
          name: 'Contract start date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'contract_start_date',
        })
      }
    ),
    contractEndDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'contractEndDate',
          name: 'Contract end date',
          type: 'date',
          bucket: true
        }),
      elastic: () => ({
        field: 'contract_end_date',
      }),
      }
    ),
    repaymentMethod: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'repaymentMethod',
          name: 'Repayment method',
          type: 'string',
          placeHolder: '',
          suggests: []
        }),
        elastic: () => ({
          field: 'repayment_method',
        })
      }
    ),
    typeOfContract: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'typeOfContract',
          name: 'Type of contract',
          type: 'string',
          placeHolder: '',
          suggests: []
        }),
        elastic: () => ({
          field: 'type_of_contract',
        }),
      }
    ),
  })
});

export default Customer