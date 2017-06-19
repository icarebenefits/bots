const Scripts = () => ({
  lang: "painless",
  rfm: {
    icareMember: {
      parent: "ctx._parent=null",
      recency: "ctx._source.recency = null",
      frequency: "ctx._source.frequency = null",
      monetary: "ctx._source.monetary = null",
      recencyScore: "ctx._source.recency_score = 0",
      frequencyScore: "ctx._source.frequency_score = 0",
      monetaryScore: "ctx._source.monetary_score = 0"
    }
  }
});

export default Scripts