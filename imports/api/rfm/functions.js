import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import {Promise} from 'meteor/promise';
import RequestPromise from 'request-promise';
import _ from 'lodash';

/* Elastic */
import {ElasticClient as Elastic} from '/imports/api/elastic';
/* Utils */
import {getIndexSuffix} from '/imports/utils';
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
        .query('exists', 'field', 'has_rfm')
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
    // console.log('count', `${count}/${total}`);
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
      // console.log('count', `${count}/${total}`);
    }

    // return the dataset which have unique elements
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
    // console.log('sample', JSON.stringify(sample));

    return quantiles;
  } catch (err) {
    throw new Meteor.Error('CALCULATE_QUINTILES', err.message);
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
    throw new Meteor.Error('CALCULATE_RFM_SCORE', err.message);
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

    // console.log('search', JSON.stringify({index, type, body}));
    // console.log('aggregations', aggregations);
    // console.log('currentDate', currentDate);
    // console.log('lastPurchaseDate', lastPurchaseDate);
    // console.log('RFM', JSON.stringify({recency, frequency, monetary}));
    return {recency, frequency, monetary};
  } catch (err) {
    throw new Meteor.Error('CALCULATE_RFM_SCORE', err.message);
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
            monetary,
            has_rfm: true
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

const getScore = ({quantiles, value}) => {
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
    const request = {
      method: 'POST',
      uri: 'http://465d2755261b93e5f67613437921e0aeac26e919:f4d7ccafb99625cbde14b5cbc8ed070b2bbc52db@gandalf.b2b.stage.icbsys.net/api/v1/tables/594109a8e79e855ada2fb1c5/decisions',
      headers: {
        'X-Application': '5941020ae79e855ac4301714'
      },
      body: {
        recency_score: recencyScore,
        frequency_monetary_score: Math.floor((frequencyScore + monetaryScore) / 2)
      }, json: true
    };
    const {meta: {code}, data: {final_decision}} = await RequestPromise(request);
    if(code === 200) {
      const {segment} = JSON.parse(final_decision);
      return {segment};
    }
    throw new Meteor.Error('GET_RFM_SEGMENT', `Code: ${code}`);
  } catch (err) {
    throw new Meteor.Error('GET_RFM_SEGMENT', err.message);
  }
};

const indexGroupSegments = async ({hits, index, type, count}) => {
  try {
    for (const hit of hits) {
      const {_id: id,
        _source: {recency_score: recencyScore, frequency_score: frequencyScore, monetary_score: monetaryScore}
      } = hit;
      const {segment} = await getRFMSegment({recencyScore, frequencyScore, monetaryScore});
      const body = {doc: {segment}};
      count++;
      await Elastic.update({index, type, id, body});
    }
    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_GROUP_SEGMENTS', err.message);
  }
};

export const indexAllSegments = async ({country}) => {
  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types.year,
      body = bodybuilder()
        .query('exists', 'field', 'has_rfm')
        .build();
    let count = 0, scrollId = '';

    body.size = batches;
    body._source = ["recency_score", "frequency_score", "monetary_score"];

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    const {count: runCount} = await indexGroupSegments({hits, index, type, count});
    count = runCount;
    scrollId = _scroll_id;
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      const {count: runCount} = await indexGroupSegments({hits, index, type, count});
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
          frequency_score = getScore({quantiles: frequencyQuantiles, value: frequency}),
          monetary_score = getScore({quantiles: monetaryQuantiles, value: monetary});
        let
          recency_score = getScore({quantiles: recencyQuantiles, value: recency});

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
export const indexAllRFMScores = async({country}) => {
  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types.year,
      body = bodybuilder()
        .query('exists', 'field', 'has_rfm')
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
export const indexRFMModel = async({country}) => {
  check(country, String);

  try {
    const
      runDate = new Date(),
      {suffix} = getIndexSuffix(runDate, 'day'),
      {
        elastic: {indices: {base: baseIndex, bots: botsIndex, rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      period = rfmIndex.periods.year,
      source = {
        index: `${botsIndex.prefix}_${country}_${env}`,
        type: botsIndex.types.sales_order
      },
      dest = {
        index: `${rfmIndex.prefix}_${country}_${env}-${suffix}`,
        type: rfmIndex.types.year
      };
    let
      index = '', type = '',
      scrollId = '', count = 0,
      body = bodybuilder()
        .query('has_child', {type: source.type}, (q) => {
          return q
            .filter('range', 'purchase_date', {gte: period})
            .query('exists', 'field', 'magento_customer_id')
        })
        .build();

    /* Reindex iCare member */
    /* iCare member */
    const reindexSource = {
        index: `${baseIndex.prefix}_${env}_${country}`,
        type: baseIndex.types.icare_member,
        _source: ["id", "full_name", "gender", "company", "business_unit", "email", "telephone"],
        query: {
          bool: {
            filter: {
              range: {
                created_at: {
                  gte: period
                }
              }
            },
            must: [
              {
                exists: {
                  field: "organization_id"
                }
              }
            ]
          }
        }
      },
      options = {refresh: true, waitForCompletion: true, requestTimeout: 120000},
      {lang, rfm: {icareMember: iCMsScripts}} = Scripts(),
      script = {
        lang,
        inline: Object.keys(iCMsScripts)
          .map(s => iCMsScripts[s])
          .join(';')
      };
    const {segment} = await getRFMSegment({recencyScore: 0, frequencyScore: 0, monetaryScore: 0});
    script.inline += `;ctx._source.segment = \"${segment}\"`;
    // console.log('source', JSON.stringify({source: reindexSource, dest, script, options}));
    // console.log('dest', dest);
    const reindexICM = await Functions().asyncReindex({source: reindexSource, dest, script, options});

    /* Update RFM Values */
    index = source.index;
    type = botsIndex.types.icare_member;
    body = bodybuilder()
      .query('has_child', {type: source.type}, (q) => {
        return q
          .filter('range', 'purchase_date', {gte: period})
          .query('exists', 'field', 'magento_customer_id')
      })
      .build()
    body.size = batches;
    body._source = ["name", "gender", "company", "business_unit", "email", "phone"];

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

    /* Change index for bots alias */
    let
      removes = [],
      adds = [];
    const alias = `${rfmIndex.prefix}_${country}_${env}`;
    const getAliasIndices = await Functions().getAliasIndices({alias});
    getAliasIndices && (removes = getAliasIndices.indices);
    adds = [dest.index];

    const updateAliases = await Functions().updateAliases({alias, removes, adds});
    // console.log('updateAliases', updateAliases);

    return {reindexICM, updateRFMValues: count, updateAliases};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFM_MODEL', err.message);
  }
};