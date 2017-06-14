const Scripts = () => ({
  lang: "painless",
  rfm: {
    icareMember: {
      name: "ctx._source.name = ctx._source.remove(\"full_name\")",
      phone: "ctx._source.phone = ctx._source.remove(\"telephone\")",
      magentoCustomerId: "ctx._source.magento_customer_id = ctx._source.remove(\"id\")",
      recency: "ctx._source.recency = 0",
      frequency: "ctx._source.frequency = 0",
      monetary: "ctx._source.monetary = 0",
      RScore: "ctx._source.RScore = 0",
      FScore: "ctx._source.FScore = 0",
      MScore: "ctx._source.MScore = 0"
    }
  }
});

export default Scripts