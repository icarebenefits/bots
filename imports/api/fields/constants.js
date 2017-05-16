export const PLACEHOLDER = {
  name: '',
  phone: '',
  email: '',
  address: '',
  jobTitle: '',
  department: '',
  paymentMethod: '',
  typeOfContract: '',
  bankName: '',
  status: '',
  soNumber: '',
  purchaseStore: '',
  purchasedBy: '',
  purchasedByChannel: '',
  shipToName: '',
  shipToAddress: '',
  billToName: '',
  billToAddress: '',
  ticketId: '',
  ticketTitle: '',
  ticketType: '',
  ticketPriority: '',
  staffName: '',
  staffEmail: '',
};

export const SUGGESTS = {
  customer: {
    paymentMethod: [],
    typeOfContract: [],
    bankName: []
  },
  iCareMember: {
    paymentMethod: [],
    typeOfContract: [],
    bankName: []
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
  }
};