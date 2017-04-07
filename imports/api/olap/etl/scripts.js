const scripts = {
  lang: "painless",
  bots: {
    customers: {
      netsuiteId: "ctx._source.netsuite_id = ctx._source.remove(\"id\")",
      customerId: "ctx._source.customer_id = ctx._source.remove(\"b2b_customer_id\")",
      name: "ctx._source.name = ctx._source.remove(\"company_name\")",
    },
    icareMembers: {
      name: "ctx._source.name = ctx._source.remove(\"full_name\")",
      phone: "ctx._source.phone = ctx._source.remove(\"telephone\")",
      magentoCustomerId: "ctx._source.magento_customer_id = ctx._source.remove(\"id\")",
      mifosClientId: "ctx._source.mifos_client_id = ctx._source.remove(\"m_client_id\")",
      netsuiteBusinessUnitId: "ctx._source.netsuite_business_unit_id = ctx._source.remove(\"business_unit_id\")",
      netsuiteCustomerId: "ctx._source.netsuite_customer_id = ctx._source.remove(\"organization_id\")",
      inactivate: "ctx._source.inactivate = !(ctx._source.remove(\"is_active\") != 0)",
      availableCreditLimit: "ctx._source.available_credit_limit = ctx._source.remove(\"m_available_credit_limit\")",
      availableDueLimit: "ctx._source.available_due_limit = ctx._source.remove(\"m_available_due_limit\")",
      maternityLeaveStartDate: "ctx._source.maternity_leave_start_date = ctx._source.remove(\"maternity_start_date\")",
      maternityLeaveEndDate: "ctx._source.maternity_leave_end_date = ctx._source.remove(\"maternity_end_date\")",
      lastPurchaseDate: "ctx._source.last_purchase_date = ctx._source.remove(\"last_purchased\")",
      defaultShippingAddress: "ctx._source.default_shipping_address = ctx._source.remove(\"defaultShippingAddress\")",
      nextPayments: "ctx._source.next_payments = ctx._source.remove(\"m_next_payments\")",
      totalLoanBalance: "ctx._source.total_loan_balance = ctx._source.remove(\"m_total_loan_balance\")",
      totalLoanPrincipal: "ctx._source.total_loan_principal = ctx._source.remove(\"m_total_loan_principal\")",
      totalPaidAmount: "ctx._source.total_paid_amount = ctx._source.remove(\"m_total_paid_amount\")",
      totalIsingCreditAmount: "ctx._source.total_using_credit_amount = ctx._source.remove(\"m_total_using_credit_amount\")",
      totalUsingDueAmount: "ctx._source.total_using_due_amount = ctx._source.remove(\"m_total_using_due_amount\")",
      clientId: "ctx._source.remove(\"client_id\")",
      mClient: "ctx._source.remove(\"m_client\")",
    },
  }
};

export default scripts