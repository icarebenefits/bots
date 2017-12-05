import Standard from './standard';
import {SUGGESTS} from './constants';
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
          type: 'string',
          placeHolder: '',
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
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.salesOrder.status
        }),
        elastic: () => ({
          field: 'so_status',
        }),
      }
    ),
    soIsCashAdvance: () => Object.assign(
      {},
      Standard().Bool(),
      {
        props: () => ({
          id: 'soIsCashAdvance',
          name: 'Is Cash Advance',
          type: 'bool'
        }),
        elastic: () => ({
          field: 'is_cash_advance'
        }),
      }
    ),
    soLastStatusDate: () => Object.assign(
      {},
      Standard().Date(),
      {
        props: () => ({
          id: 'soLastStatusDate',
          name: 'Status date',
          type: 'date',
          bucket: true
        }),
        elastic: () => ({
          field: 'last_status_date',
        })
      }
    ),
    soPurchaseStore: () => Object.assign(
      {},
      Standard().String(),
      {
        props: () => ({
          id: 'soPurchaseStore',
          name: 'Purchase store',
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.salesOrder.purchaseStore
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
          type: 'string',
          bucket: true,
          placeHolder: 'icare.bots@icarebenefits.com',
          suggests: []
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
          type: 'suggest',
          bucket: true,
          placeHolder: '',
          suggests: SUGGESTS.salesOrder.purchasedByChannel
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
          type: 'date',
          bucket: true
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
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: ''
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
          type: 'string',
          placeHolder: ''
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
    soNumberItems: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'soNumberItems',
          name: 'Number items',
          type: 'number',
          placeHolder: ''
        }),
        elastic: () => ({
          field: 'number_items'
        })
      }
    ),
    soItems: () => ({
      props: () => ({
        id: 'soItems',
        name: 'Items',
        bucket: 'true', 
        type: 'nested'
      }),
      elastic: () => ({
        id: 'items.sku'
      }),
      field: () => ({
        soItemSKU: () => Object.assign(
          {},
          Standard().String(),
          {
            props: () => ({
              id: 'soItemSKU',
              name: 'SKU',
              type: 'string',
              bucket: true,
              placeHolder: '...ICARE-SHOES001'
            }),
            elastic: () => ({
              field: 'items.sku',
              type: 'nested',
              path: 'items'
            })
          }
        ),
        soItemName: () => Object.assign(
          {},
          Standard().String(),
          {
            props: () => ({
              id: 'soItemName',
              name: 'Name',
              type: 'string',
              bucket: true,
              placeHolder: '...Cooker'
            }),
            elastic: () => ({
              field: 'items.name',
              type: 'nested',
              path: 'items'
            })
          }
        ),
        soItemQuantity: () => Object.assign(
          {},
          Standard().Number(),
          {
            props: () => ({
              id: 'soItemQuantity',
              name: 'Quantity',
              type: 'number',
              placeHolder: ''
            }),
            elastic: () => ({
              field: 'items.quantity',
              type: 'nested',
              path: 'items'
            })
          }
        )
      })
    })
  })
});

export default iCMSalesOrder