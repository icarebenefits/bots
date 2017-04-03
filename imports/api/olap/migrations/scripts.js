const scripts = {
  bots: {
    customers: {
      netsuiteId: "ctx._source.netsuite_id = ctx._source.remove(\"id\")",
      customerId: "ctx._source.customer_id = ctx._source.remove(\"b2b_customer_id\")",
    }
  }
};