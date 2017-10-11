export const SUGGESTS = {
  customer: {
    paymentMethod: [],
    typeOfContract: [],
    bankName: []
  },
  iCareMember: {
    paymentMethod: [],
    typeOfContract: [],
    bankName: [],
    status: [
      {name: 'active', label: 'Active'},
      {name: 'inActive', label: 'Inactive'},
    ],
    RFMSegment: [
      {name: 'champion', label: 'Champion'},
      {name: 'loyal customers', label: 'Loyal Customers'},
      {name: 'potential loyalist', label: 'Potential Loyalist'},
      {name: 'new customers', label: 'New Customers'},
      {name: 'promising', label: 'Promising'},
      {name: 'customers needing attention', label: 'Customers Needing Attention'},
      {name: 'about to sleep', label: 'About to Sleep'},
      {name: 'at risk', label: 'At Risk'},
      {name: "can't lose them", label: "Can't Lose Them"},
      {name: 'hibernating', label: 'Hibernating'},
      {name: 'lost', label: 'Lost'},
    ]
  },
  salesOrder: {
    status: [
      {name: 'canceled', label: 'canceled'},
      {name: 'confirmed', label: 'confirmed'},
      {name: 'delivered', label: 'delivered'},
      {name: 'delivery_failed', label: 'delivery failed'},
      {name: 'holded', label: 'holded'},
      {name: 'packed', label: 'packed'},
      {name: 'pending', label: 'pending'},
      {name: 'processing', label: 'processing'},
      {name: 'shipped', label: 'shipped'}
    ],
    purchaseStore: [
      {name: 'Admin', label: 'Admin'},
      {name: 'Default Store View', label: 'Default Store View'},
      {name: 'KH - Overall', label: 'KH - Overall'},
      {name: 'LA - Overall', label: 'LA - Overall'},
      {name: 'VN - Centre', label: 'VN - Centre'},
      {name: 'VN - North', label: 'VN - North'},
      {name: 'VN - South', label: 'VN - South'}
    ],
    purchasedByChannel: [
      {name: 'field sales', label: 'Field Sales'},
      {name: 'telesales', label: 'Telesales'},
      {name: 'telesales rep', label: 'Telesales Rep'},
      {name: 'telesales manager', label: 'Telesales Manager'},
      {name: 'telesales team leader', label: 'Telesales Team Leader'},
      {name: 'content writer', label: 'Content Writer'},
      {name: 'operations', label: 'Operations'}
    ]
  },
  ticket: {
    type: [
      {name: 'installment', label: 'installment'},
      {name: 'sales orders', label: 'sales orders'},
      {name: 'credit', label: 'credit'},
      {name: 'security', label: 'security'},
      {name: 'system support', label: 'system support'},
      {name: 'reset pincode', label: 'reset pincode'},
      {name: 'lock device', label: 'lock device'},
      {name: 'b2b', label: 'b2b'},
      {name: 'cancel order', label: 'cancel order'},
      {name: 'deposit money', label: 'deposit money'},
      {name: 'update loan', label: 'update loan'},
      {name: 'generic', label: 'generic'},
      {name: 'account login', label: 'account login'}
    ],
    priority: [
      {name: 'High', label: 'High'},
      {name: 'Medium', label: 'Medium'}
    ],
    status: [
      {name: 'Closed', label: 'Closed'},
      {name: 'Open', label: 'Open'},
      {name: 'In Progress', label: 'In Progress'}
    ]
  },
  kyc: {
    nationality: [
      {name: 'Vietnam', label: 'Vietnam'},
      {name: 'Cambodia', label: 'Cambodia'},
      {name: 'Laos', label: 'Laos'},
      {name: 'VN', label: 'VN'},
      {name: 'Iran', label: 'Iran'},
      {name: 'Poland', label: 'Poland'},
      {name: 'United States', label: 'United States'},
      {name: 'Russia', label: 'Russia'},
      {name: 'Kazakhstan', label: 'Kazakhstan'},
    ],
    createdByUserRole: [
      {name: 'FS', label: 'Field Sales'},
      {name: 'TLS', label: 'Telesales'},
      {name: 'ICM', label: 'iCare Member'}
    ],
    approvedOrRejectedByUserRole: [
      {name: 'ICARE_STAFF', label: 'iCare Staff'},
      {name: 'B2B_ADMIN', label: 'B2B Admin'}
    ],
    assignedToUserRole: [
      {name: 'ICARE_STAFF', label: 'iCare Staff'},
      {name: 'B2B_ADMIN', label: 'B2B Admin'}
    ],
    status: [
      {name: 'initial', label: 'initial'},
      {name: 'pending', label: 'pending'},
      {name: 'in_progress', label: 'in progress'},
      {name: 'awaiting_more_info', label: 'awaiting more info'},
      {name: 'rejected', label: 'rejected'},
      {name: 'approved', label: 'approved'}
    ]
  }
};