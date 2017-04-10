import StandardFields from '../standard/fields';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMSaleOrder = {
  props: {
    id: 'iCMSaleOrder',
    name: 'iCare member sale order',
    type: 'group',
    elastic: {
      parent: 'icare_members'
    },
  },
  fields: {
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
    purchaseStore: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'purchaseStore',
          name: 'Purchase store',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'purchase_store',
          },
        }
      }
    ),
    purchaseDate: () => Object.assign(
      {},
      StandardFields.DateField(),
      {
        props: {
          id: 'purchaseDate',
          name: 'Purchase date',
          type: 'date',
          elastic: {
            parent: 'icare_members',
            field: 'purchase_date',
          },
        }
      }
    ),
    shipToName: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'shipToName',
          name: 'Ship to name',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'ship_to_name',
          }
        }
      }
    ),
    billToName: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'billToName',
          name: 'Bill to name',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'bill_to_name',
          }
        }
      }
    ),
    grandTotalBase: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'grandTotalBase',
          name: 'Grand total base',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'grand_total_base',
          }
        }
      }
    ),
    grandTotalPurchase: () => Object.assign(
      {},
      StandardFields.NumberField(),
      {
        props: {
          id: 'grandTotalPurchase',
          name: 'Grand total purchase',
          type: 'number',
          elastic: {
            parent: 'icare_members',
            field: 'grand_total_purchase',
          }
        }
      }
    ),
    status: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'status',
          name: 'status',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'so_status',
          }
        }
      }
    ),
    purchasedByEmail: () => Object.assign(
      {},
      StandardFields.StringField(),
      {
        props: {
          id: 'purchasedByEmail',
          name: 'Purchased by email',
          type: 'string',
          elastic: {
            parent: 'icare_members',
            field: 'purchased_by',
          }
        }
      }
    ),
  }
};

export default iCMSaleOrder