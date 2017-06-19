const Scripts = () => ({
  lang: "painless",
  rfm: {
    icareMember: {
      magentoCustomerId: "ctx._source.magento_customer_id = ctx._source.remove(\"id\")",
      netsuiteCustomerId: "ctx._source.netsuite_customer_id = ctx._source.remove(\"organization_id\")",
      name: "ctx._source.name = ctx._source.remove(\"full_name\")",
      phone: "ctx._source.phone = ctx._source.remove(\"telephone\")",
      recency: "ctx._source.recency = 0",
      frequency: "ctx._source.frequency = 0",
      monetary: "ctx._source.monetary = 0",
      recencyScore: "ctx._source.recency_score = 0",
      frequencyScore: "ctx._source.frequency_score = 0",
      monetaryScore: "ctx._source.monetary_score = 0"
    }
  }
});

export default Scripts