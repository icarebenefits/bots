import Standard from './standard';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMSalesOrder = () => ({
  props: () => ({
    id: 'iCMSalesOrder',
    name: 'iCare member sales order',
    type: 'group'
  }),
  elastic: () => ({
    id: 'so_number',
    type: 'sales_order',
    grandParent: 'customer',
    parent: 'icare_member',
  }),
  field: () => ({
    soNumber: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soNumber',
          name: 'SO number',
          type: 'string'
        }),
        elastic: () => ({
          field: 'so_number',
        })
      }
    ),
    soStatus: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soStatus',
          name: 'Status',
          type: 'string'
        }),
        elastic: () => ({
          field: 'so_status',
        }),
      }
    ),
    soPurchaseStore: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soPurchaseStore',
          name: 'Purchase store',
          type: 'string'
        }),
        elastic: () => ({
          field: 'purchase_store',
        }),
      }
    ),
    soPurchasedBy: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soPurchasedBy',
          name: 'Purchase by',
          type: 'string'
        }),
        elastic: () => ({
          field: 'purchased_by',
        })
      }
    ),
    soPurchasedByChannel: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soPurchasedByChannel',
          name: 'Purchase by channel',
          type: 'string'
        }),
        elastic: () => ({
          field: 'purchased_by_channel',
        })
      }
    ),
    soPurchaseDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'soPurchaseDate',
          name: 'Purchase date',
          type: 'date'
        }),
        elastic: () => ({
          field: 'purchase_date',
        })
      }
    ),
    soShipToName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soShipToName',
          name: 'Ship to name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'ship_to_name',
        })
      }
    ),
    soShipToAddress: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soShipToAddress',
          name: 'Ship to address',
          type: 'string'
        }),
        elastic: () => ({
          field: 'ship_to_address',
        })
      }
    ),
    soBillToName: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soBillToName',
          name: 'Bill to name',
          type: 'string'
        }),
        elastic: () => ({
          field: 'bill_to_name',
        })
      }
    ),
    soBillToAddress: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soBillToAddress',
          name: 'Bill to address',
          type: 'string'
        }),
        elastic: () => ({
          field: 'bill_to_address',
        })
      }
    ),
    soGrandTotalBase: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'soGrandTotalBase',
          name: 'Grand total base',
          type: 'number'
        }),
        elastic: () => ({
          field: 'grand_total_base',
        })
      }
    ),
    soGrandTotalPurchase: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'soGrandTotalPurchase',
          name: 'Grand total purchase',
          type: 'number'
        }),
        elastic: () => ({
          field: 'grand_total_purchase',
        })
      }
    ),
  })
});

export default iCMSalesOrder