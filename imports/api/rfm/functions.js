import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import {Promise} from 'meteor/promise';
import RequestPromise from 'request-promise';
import _ from 'lodash';

/* Collections */
import {RFMScoreBoard, RFMTopTen} from '/imports/api/collections/rfm';
/* Elastic */
import {ElasticClient as Elastic} from '/imports/api/elastic';
/* Utils */
import {Parser} from '/imports/utils';
/* Functions */
import {Functions} from '/imports/api/olap';
/* Scripts */
import Scripts from './scripts';

/**
 * Get the Dataset for Recency, Frequency, Monetary
 * @param index
 * @param type
 * @param batches
 * @param scroll
 * @returns {{RDataSet: Array, FDataSet: Array, MDataSet: Array}}
 */
const getRFMDataSet = async({index, type, batches, scroll}) => {
  try {
    const
      recencyDataSet = [], // Recency data set
      frequencyDataSet = [], // Frequency data set
      monetaryDataSet = [], // Monetary data set
      body = bodybuilder()
        .query('match_all', {})
        .build();
    let count = 0, scrollId = '';

    body.size = batches;
    body._source = ["recency", "frequency", "monetary"];

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    hits.map(hit => {
      const {_source: {recency, frequency, monetary}} = hit;
      recencyDataSet.push(recency);
      frequencyDataSet.push(frequency);
      monetaryDataSet.push(monetary);
      count++;
    });
    scrollId = _scroll_id;
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      hits.map(hit => {
        const {_source: {recency, frequency, monetary}} = hit;
        recencyDataSet.push(recency);
        frequencyDataSet.push(frequency);
        monetaryDataSet.push(monetary);
        count++;
      });
      scrollId = _scroll_id;
    }

    return {
      recencyDataSet: _.uniq(recencyDataSet),
      frequencyDataSet: _.uniq(frequencyDataSet),
      monetaryDataSet: _.uniq(monetaryDataSet)
    };
  } catch (err) {
    throw new Meteor.Error('GET_RFM_DATASET', err.message);
  }
};

/**
 * Calculate the quartile position of Quantiles from a data set
 * https://en.wikipedia.org/wiki/Quantile
 * @param q - the type of quantiles (2: Median, 3: Tertiles, 4: Quartiles, 5: Quintiles)
 * @param dataset
 * @returns {Array}
 */
const calculateQuantiles = (dataset) => {
  check(dataset, [Number]);
  try {
    const
      sample = dataset.sort((a, b) => (a - b)), // Order the data from smallest to largest
      n = sample.length, // Count how many observations you have in your data set.
      quantiles = [];
    let qQuantiles = [];

    // Median
    if (n < 3) {
      qQuantiles = [0.5];
    }
    // Tertiles
    if (n > 2 && n < 4) {
      qQuantiles = [0.33, 0.66];
    }
    // Quartiles
    if (n > 3 && n < 5) {
      qQuantiles = [0.25, 0.5, 0.75];
    }
    // Quintiles
    if (n >= 5) {
      qQuantiles = [0.2, 0.4, 0.6, 0.8];
    }

    qQuantiles.forEach(q => {
      const o = Math.floor(q * (n + 1)); // ith observation
      quantiles.push(sample[o]);
    });

    return quantiles;
  } catch (err) {
    throw new Meteor.Error('CALCULATE_QUANTILES', err.message);
  }
};

/**
 * Calculate RFM Quantiles
 * @param index
 * @param type
 * @param batches
 * @param scroll
 * @returns {{RQuantiles: Array, FQuantiles: Array, MQuantiles: Array}}
 */
const calculateRFMQuantiles = async({index, type, batches, scroll}) => {
  try {
    // get all dataset of RFM
    const {recencyDataSet, frequencyDataSet, monetaryDataSet} = await getRFMDataSet({index, type, batches, scroll});


    /* Calculate RFM Quantiles */
    const
      recencyQuantiles = calculateQuantiles(recencyDataSet), // Recency
      frequencyQuantiles = calculateQuantiles(frequencyDataSet), // Frequency
      monetaryQuantiles = calculateQuantiles(monetaryDataSet); // Monetary
    // The more recent the better recency
    // RQuantiles.reverse();


    return {recencyQuantiles, frequencyQuantiles, monetaryQuantiles};
  } catch (err) {
    throw new Meteor.Error('CALCULATE_RFM_QUANTILES', err.message);
  }
};

/**
 * Function calculate Recency, Frequency, Monetary Values of a user in a period - server
 * @param {String} index - Ex: "bots_vn_stage"
 * @param {String} type - Ex: "sales_order"
 * @param {String} _id - Ex: ""
 * @param {String} period - Ex: "now-1y"
 * @returns {recency, frequency, monetary}
 */
const calculateRFMValue = async({index, type, id, period, runDate}) => {
  check(index, String);
  check(type, String);
  check(id, Match.OneOf(Number, String));
  check(period, String);
  check(runDate, Date);

  try {
    const
      key = 'magento_customer_id',
      aggType = 'max',
      periodField = 'purchase_date',
      RField = 'purchase_date',
      MField = 'grand_total_purchase',
      body = bodybuilder()
        .size(0)
        .filter('term', key, id)
        .filter('range', periodField, {gte: period})
        .aggregation(aggType, RField)
        .aggregation(aggType, MField)
        .build();

    // get last purchase date of user
    const {hits: {total: frequency}, aggregations} = await Elastic.search({index, type, body});
    const
      {value_as_string: lastPurchaseDate} = aggregations[`agg_${aggType}_${RField}`],
      {value: monetary} = aggregations[`agg_${aggType}_${MField}`];
    const recency = moment(runDate).diff(lastPurchaseDate, 'days');

    return {recency, frequency, monetary};
  } catch (err) {
    throw new Meteor.Error('CALCULATE_RFM_VALUE', err.message);
  }
};

/**
 * Index the RFM Values for every customer
 * @param hits
 * @param source
 * @param dest
 * @param period
 * @param runDate
 * @param count
 * @returns {{count: *}}
 */
const updateRFMValues = async({hits, source, dest, period, runDate, count}) => {
  try {
    let index = '', type = '';
    await Promise.all(hits.map(
      async hit => {
        index = source.index;
        type = source.type;
        const {_id: id, _source} = hit;
        const {recency, frequency, monetary} = await calculateRFMValue({index, type, id, period, runDate});
        index = dest.index;
        type = dest.type;
        const body = {
          doc: {
            ..._source,
            recency,
            frequency,
            monetary
          }, doc_as_upsert: true
        };
        await Elastic.update({index, type, id, body});
        count++;
      }));
    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFM_VALUES', err.message);
  }
};

/**
 * Calculate score for a value with quantitles
 * @param quantiles
 * @param value
 * @returns {number}
 */
const calculateScore = ({quantiles, value}) => {
  const n = quantiles.length;

  for (let i = 0; i < n; i++) {
    if (value <= quantiles[i]) {
      return i + 1;
    }
    if (i === (n - 1) && value > quantiles[i]) {
      return i + 2;
    }
  }
};

/**
 * Get segment of customer from Gandalf Decision making with RFM
 * @param recencyScore
 * @param frequencyScore
 * @param monetaryScore
 * @returns {{segment}}
 */
export const getRFMSegment = async({recencyScore, frequencyScore, monetaryScore}) => {
  try {
    const {domain, clientId, clientSecret, tableId, appId} = Meteor.settings.gandalf;
    const request = {
      method: 'POST',
      uri: `http://${clientId}:${clientSecret}@${domain}/api/v1/tables/${tableId}/decisions`,
      headers: {
        'X-Application': appId
      },
      body: {
        recency_score: null,
        frequency_monetary_score: null
      }, json: true
    };
    if (recencyScore && recencyScore && monetaryScore) {
      request.body = {
        recency_score: recencyScore,
        frequency_monetary_score: Math.floor((frequencyScore + monetaryScore) / 2)
      };
    }
    const {meta: {code}, data: {final_decision}} = await RequestPromise(request);
    if (code === 200) {
      const {segment} = JSON.parse(final_decision);
      return {segment};
    }
    throw new Meteor.Error('GET_RFM_SEGMENT', `Code: ${code}`);
  } catch (err) {
    throw new Meteor.Error('GET_RFM_SEGMENT', err.message);
  }
};

/**
 * Index a Chunk of iCMs Segment
 * @param hits
 * @param index
 * @param type
 * @param count
 * @returns {{count: *}}
 */
const indexSegmentForChunkOfiCM = async({hits, index, type, count}) => {
  try {
    /* Update sequential */
    /*
     for (const hit of hits) {
     const {_id: id,
     _source: {recency_score: recencyScore, frequency_score: frequencyScore, monetary_score: monetaryScore}
     } = hit;
     const {segment} = await getRFMSegment({recencyScore, frequencyScore, monetaryScore});
     const body = {doc: {segment}};
     count++;
     await Elastic.update({index, type, id, body});
     }
     */
    /* Update parallel */
    await Promise.all(hits.map(
      async hit => {
        const {
          _id: id,
          _source: {recency_score: recencyScore, frequency_score: frequencyScore, monetary_score: monetaryScore}
        } = hit;
        const {segment} = await getRFMSegment({recencyScore, frequencyScore, monetaryScore});
        const body = {doc: {segment}};
        await Elastic.update({index, type, id, body});
        count++;
      }));
    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_GROUP_SEGMENTS', err.message);
  }
};

/**
 * Index segment for all of iCMs who have RFM Scores.
 * @param country
 * @param rfmType
 * @returns {{count: number}}
 */
export const indexSegmentForAllOfiCM = async({country, rfmType = 'year'}) => {
  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types[rfmType],
      body = bodybuilder()
        .query('match_all', {})
        .build();
    let count = 0, scrollId = '';

    // body.size = batches;  // default batches is 10 documents per chunk
    body._source = ["recency_score", "frequency_score", "monetary_score"];

    // get chunk of iCM
    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    // update Segment for the chunk of iCM above
    const {count: runCount} = await indexSegmentForChunkOfiCM({hits, index, type, count});
    count = runCount;
    scrollId = _scroll_id;
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      const {count: runCount} = await indexSegmentForChunkOfiCM({hits, index, type, count});
      count = runCount;
      scrollId = _scroll_id;
    }

    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_ALL_SEGMENTS', err.message);
  }
};

/**
 * Index RFM scores for the group of iCare members
 * @param quantiles
 * @param hits
 * @param index
 * @param type
 * @param count
 * @returns {{count: *}}
 */
const indexGroupRFMScores = async({quantiles, hits, index, type, count}) => {
  try {
    const {recencyQuantiles, frequencyQuantiles, monetaryQuantiles} = quantiles;
    await Promise.all(hits.map(
      async hit => {
        const
          {_id: id, _source: {recency, frequency, monetary}} = hit,
          frequency_score = calculateScore({quantiles: frequencyQuantiles, value: frequency}),
          monetary_score = calculateScore({quantiles: monetaryQuantiles, value: monetary});
        let
          recency_score = calculateScore({quantiles: recencyQuantiles, value: recency});

        // Calculate recency_score
        const q = recencyQuantiles.length + 1;
        recency_score = q - recency_score + 1;

        const body = {
          doc: {
            recency_score,
            frequency_score,
            monetary_score
          }
        };
        await Elastic.update({index, type, id, body});
        count++;
      }));
    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_GROUP_RFM_SCORE', err.message);
  }
};

/**
 * Index RFM scores for all of iCare members
 * @param country
 * @returns {{count: number}}
 */
export const indexAllRFMScores = async({country, rfmType = 'year'}) => {
  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types[rfmType],
      body = bodybuilder()
        .query('match_all', {})
        .build();
    let count = 0, scrollId = '';

    const quantiles = await calculateRFMQuantiles({index, type, batches, scroll});
    // update option quantitles
    const {recencyQuantiles, frequencyQuantiles, monetaryQuantiles} = quantiles;
    recencyQuantiles.reverse();
    await Elastic.update({
      index, type: 'options', id: 'quantiles',
      body: {
        doc: {
          recency_quantiles: recencyQuantiles,
          frequency_quantiles: frequencyQuantiles,
          monetary_quantiles: monetaryQuantiles
        },
        doc_as_upsert: true
      }
    });

    body.size = batches;
    body._source = ["recency", "frequency", "monetary"];

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    const {count: runCount} = await indexGroupRFMScores({quantiles, hits, index, type, count});
    count = runCount;
    scrollId = _scroll_id;
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      const {count: runCount} = await indexGroupRFMScores({quantiles, hits, index, type, count});
      count = runCount;
      scrollId = _scroll_id;
    }

    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFM_SCORES', err.message);
  }
};

/**
 * Index the RFM Values of customers for every country
 * @param country
 * @returns {{count: number}}
 */
export const indexRFMModel = async({runDate = new Date(), country}) => {
  check(country, String);

  try {
    const
      rfmType = 'year',
      {suffix} = Parser().indexSuffix(runDate, 'day'),
      {
        elastic: {indices: {base: baseIndex, bots: botsIndex, rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      period = rfmIndex.periods[rfmType],
      source = {
        index: `${botsIndex.prefix}_${country}_${env}`,
        type: botsIndex.types.sales_order
      },
      dest = {
        index: `${rfmIndex.prefix}_${country}_${env}-${suffix}`,
        type: rfmIndex.types[rfmType]
      };
    let
      index = '', type = '',
      scrollId = '', count = 0,
      body = {};

    /* Reindex iCare member */
    /* iCare member */
    const reindexSource = {
        index: source.index,
        type: botsIndex.types.icare_member,
        _source: ["magento_customer_id", "netsuite_customer_id", "name", "gender", "company", "business_unit", "email", "phone"],
        query: bodybuilder()
          .query('has_child', {type: "sales_order"}, (q) => {
            return q
              .filter('range', 'purchase_date', {gte: period})
              .filter('exists', 'field', 'magento_customer_id')
              .notFilter('term', 'so_status.keyword', 'canceled')
              .notFilter('nested', 'path', 'items', q => {
                return q
                  .query('term', 'items.sku.keyword', 'LOAN-MIGRATION')
              })
          })
          .build().query
      },
      options = {refresh: true, waitForCompletion: true, requestTimeout: 120000},
      {lang, rfm: {icareMember: iCMsScripts}} = Scripts(),
      script = {
        lang,
        inline: Object.keys(iCMsScripts)
          .map(s => iCMsScripts[s])
          .join(';')
      };
    const {segment} = await getRFMSegment({});
    script.inline += `;ctx._source.segment = \"${segment}\"`;
    const reindexICM = await Functions().asyncReindex({source: reindexSource, dest, script, options});

    /* Update RFM Values */
    index = dest.index;
    type = dest.type;
    body = bodybuilder()
      .query('match_all', {})
      .build();

    body.size = batches;
    body._source = false;

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    const {count: runCount} = await updateRFMValues({hits, source, dest, period, runDate, count});
    count = runCount;
    scrollId = _scroll_id;
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      const {count: runCount} = await updateRFMValues({hits, source, dest, period, runDate, count});
      count = runCount;
      scrollId = _scroll_id;
    }

    /* Change index for rfm alias */
    let
      removes = [],
      adds = [];
    const alias = `${rfmIndex.prefix}_${country}_${env}`;
    const getAliasIndices = await Functions().getAliasIndices({alias});
    getAliasIndices && (removes = getAliasIndices.indices);
    adds = [dest.index];
    const updateAliases = await Functions().updateAliases({alias, removes, adds});

    return {index: dest.index, type: dest.type, reindexICM, updateRFMValues: count, updateAliases};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFM_MODEL', err.message);
  }
};


/**
 * Get RFM ScoreBoard for every country
 * @param country
 * @param rfmType
 * @returns {*|any|List<T>}
 */
export const getRFMScoreBoard = async({country, rfmType = 'year'}) => {
  check(country, String);

  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex, bots: botsIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types[rfmType],
      scoreboard = {
        total: 0,
        purchased: 0,
        champion: 0,
        loyal: 0,
        potential: 0,
        new: 0,
        promissing: 0,
        attention: 0,
        sleep: 0,
        risk: 0,
        losing: 0,
        hibernating: 0,
        lost: 0,
        theBestChampion: {},
        theBestLoyal: {},
        theBestPotential: {},
        country,
        date: new Date()
      },
      period = rfmIndex.periods[rfmType],
      _source = ["magento_customer_id", "netsuite_customer_id", "name", "company", "recency", "frequency", "monetary"];
    let body = bodybuilder()
        .size(0)
        .aggregation('terms', 'segment.keyword', {size: 12})
        .build(),
      segment = 'champion';

    const {hits: {total}, aggregations} = await Elastic.search({index, type, body});
    const {buckets} = aggregations['agg_terms_segment.keyword'];

    // total iCMs
    scoreboard.purchased = total;
    // segmentation iCMs
    buckets.map(bucket => {
      const {key, doc_count} = bucket;
      if (key === 'champion') {
        scoreboard.champion = doc_count;
      }
      if (key === 'loyal customers') {
        scoreboard.loyal = doc_count;
      }
      if (key === 'potential loyalist') {
        scoreboard.potential = doc_count;
      }
      if (key === 'new customers') {
        scoreboard.new = doc_count;
      }
      if (key === 'promising') {
        scoreboard.promissing = doc_count;
      }
      if (key === 'customers needing attention') {
        scoreboard.attention = doc_count;
      }
      if (key === 'about to sleep') {
        scoreboard.sleep = doc_count;
      }
      if (key === 'at risk') {
        scoreboard.risk = doc_count;
      }
      if (key === "can't lose them") {
        scoreboard.losing = doc_count;
      }
      if (key === 'hibernating') {
        scoreboard.hibernating = doc_count;
      }
      if (key === 'lost') {
        scoreboard.lost = doc_count;
      }
    });

    // total iCMs
    body = bodybuilder()
      .filter('range', 'created_at', {gte: period})
      .build();
    const {count} = await Elastic.count({
      index: `${botsIndex.prefix}_${country}_${env}`,
      type: botsIndex.types.icare_member,
      body
    });
    scoreboard.total = count;

    // the best champion
    body = bodybuilder()
      .size(1)
      .filter('term', 'segment.keyword', {value: segment})
      .sort('_script', {
        "type": "number", "script": {
          "lang": "painless",
          "inline": "params['_source']['recency_score'] + params['_source']['frequency_score'] + params['_source']['monetary_score']",
          "params": {
            "factor": 1.1
          }
        },
        "order": "desc"
      })
      .sort('monetary', 'desc')
      .sort('frequency', 'desc')
      .sort('recency', 'desc')
      .build();
    body._source = _source;
    const {hits: {hits: champions}} = await Elastic.search({index, type, body});
    if (!_.isEmpty(champions)) {
      scoreboard.theBestChampion = {...champions[0]._source};
    }

    // the best loyal
    segment = 'loyal customers';
    body = bodybuilder()
      .size(1)
      .filter('term', 'segment.keyword', {value: segment})
      .sort('_script', {
        "type": "number", "script": {
          "lang": "painless",
          "inline": "params['_source']['recency_score'] + params['_source']['frequency_score'] + params['_source']['monetary_score']",
          "params": {
            "factor": 1.1
          }
        },
        "order": "desc"
      })
      .sort('monetary', 'desc')
      .sort('frequency', 'desc')
      .sort('recency', 'desc')
      .build();
    body._source = _source;
    const {hits: {hits: loyals}} = await Elastic.search({index, type, body});
    if (!_.isEmpty(loyals)) {
      scoreboard.theBestLoyal = {...loyals[0]._source};
    }

    // the best potential
    segment = 'potential loyalist';
    body = bodybuilder()
      .size(1)
      .filter('term', 'segment.keyword', {value: segment})
      .sort('_script', {
        "type": "number", "script": {
          "lang": "painless",
          "inline": "params['_source']['recency_score'] + params['_source']['frequency_score'] + params['_source']['monetary_score']",
          "params": {
            "factor": 1.1
          }
        },
        "order": "desc"
      })
      .sort('monetary', 'desc')
      .sort('frequency', 'desc')
      .sort('recency', 'desc')
      .build();
    body._source = _source;
    const {hits: {hits: potentials}} = await Elastic.search({index, type, body});
    if (!_.isEmpty(potentials)) {
      scoreboard.theBestPotential = {...potentials[0]._source};
    }

    return RFMScoreBoard.insert(scoreboard);

  } catch (err) {
    throw new Meteor.Error('GET_RFM_SCOREBOARD', err.message);
  }
};

/**
 * Get Top Ten iCMs on every segment.
 * @param country - vn, kh, la
 * @param rfmType - year, 3years, 6months (currently support year only)
 * @returns {*|any|List<T>}
 */
export const getRFMTopTen = async({country, rfmType = 'year'}) => {
  check(country, String);

  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types[rfmType],
      topten = {
        champions: [],
        loyals: [],
        potentials: [],
        news: [],
        promissings: [],
        attentions: [],
        sleeps: [],
        risks: [],
        losings: [],
        hibernatings: [],
        losts: [],
        country,
        date: new Date()
      },
      _source = ["magento_customer_id", "netsuite_customer_id", "name", "company", "recency", "frequency", "monetary"],
      segments = [
        {champions: 'champion'},
        {loyals: 'loyal customers'},
        {potentials: 'potential loyalist'},
        {news: 'new customers'},
        {promissings: 'promising'},
        {attentions: 'customers needing attention'},
        {sleeps: 'about to sleep'},
        {risks: 'at risk'},
        {losings: "can't lose them"},
        {hibernatings: 'hibernating'},
        {losts: 'lost'}
      ];

    for (const segment of segments) {
      const
        key = Object.keys(segment)[0],
        value = segment[key],
        body = bodybuilder()
          .size(10)
          .rawOption('_source', _source)
          .filter('term', 'segment.keyword', {value})
          .sort('_script', {
            "type": "number", "script": {
              "lang": "painless",
              "inline": "params['_source']['recency_score'] + params['_source']['frequency_score'] + params['_source']['monetary_score']",
              "params": {
                "factor": 1.1
              }
            },
            "order": "desc"
          })
          .sort('monetary', 'desc')
          .sort('frequency', 'desc')
          .sort('recency', 'desc')
          .build();

      const {hits: {hits}} = await Elastic.search({index, type, body});
      if (!_.isEmpty(hits)) {
        topten[key] = hits.map(hit => hit._source);
      }
    }

    return RFMTopTen.insert(topten);

  } catch (err) {
    throw new Meteor.Error('GET_RFM_TOPTEN', err.message);
  }
};