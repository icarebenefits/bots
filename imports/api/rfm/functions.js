import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import {Promise} from 'meteor/promise';
import _ from 'lodash';

/* Elastic */
import {ElasticClient as Elastic} from '/imports/api/elastic';
/* Utils */
import {getIndexSuffix} from '/imports/utils';

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
      RDataSet = [], // Recency data set
      FDataSet = [], // Frequency data set
      MDataSet = [], // Monetary data set
      body = bodybuilder()
        .query('match_all', {})
        .build();
    let count = 0, scrollId = '';

    body.size = batches;
    body._source = ["recency", "frequency", "monetary"];

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    hits.map(hit => {
      const {_source: {recency, frequency, monetary}} = hit;
      RDataSet.push(recency);
      FDataSet.push(frequency);
      MDataSet.push(monetary);
      count++;
    });
    scrollId = _scroll_id;
    // console.log('count', `${count}/${total}`);
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      hits.map(hit => {
        const {_source: {recency, frequency, monetary}} = hit;
        RDataSet.push(recency);
        FDataSet.push(frequency);
        MDataSet.push(monetary);
        count++;
      });
      scrollId = _scroll_id;
      // console.log('count', `${count}/${total}`);
    }

    // return the dataset which have unique elements
    return {
      RDataSet: _.uniq(RDataSet),
      FDataSet: _.uniq(FDataSet),
      MDataSet: _.uniq(MDataSet)
    };
  } catch (err) {
    throw new Meteor.Error('GET_RFM_DATASET', err.message);
  }
};

const calculateMedian = dataset => {}

/**
 * Calculate the quartile position of Quantiles from a data set
 * https://en.wikipedia.org/wiki/Quantile
 * @param q - the type of quantiles (2: Median, 3: Tertiles, 4: Quartiles, 5: Quintiles)
 * @param dataset
 * @returns {Array}
 */
const calculateQuantiles = (dataset, q) => {
  check(dataset, [Number]);
  check(q, Match.Maybe(Number));
  try {
    const
      sample = dataset.sort((a, b) => (a - b)), // Order the data from smallest to largest
      n = sample.length, // Count how many observations you have in your data set.
      quantiles = []; // Array store 4 elements quartile of Quintiles (20th, 40th, 60th, 80th)
    let qQuantiles = [];

    switch (q) {
      case 2: {
        qQuantiles = [0.5];
        break;
      }
      case 3: {
        qQuantiles = [0.33, 0.66];
        break;
      }
      case 4: {
        qQuantiles = [0.25, 0.5, 0.75];
        break;
      }
      case 5: {
        qQuantiles = [0.2, 0.4, 0.6, 0.8];
        break;
      }
      default:
        qQuantiles = [0.2, 0.4, 0.6, 0.8];
    }

    qQuantiles.forEach(q => {
      const o = Math.floor(q * (n + 1)); // ith observation
      quantiles.push(sample[o]);
    });
    // console.log('sample', JSON.stringify(sample));

    return quantiles;
  } catch(err) {
    throw new Meteor.Error('CALCULATE_QUINTILES', err.message);
  }
};

export const calculateRFMScore = async({country}) => {
  try {
    const
      {
        elastic: {indices: {rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      index = `${rfmIndex.prefix}_${country}_${env}`,
      type = rfmIndex.types.year;
    // get all dataset of RFM
    const {RDataSet, FDataSet, MDataSet} = await getRFMDataSet({index, type, batches, scroll});
    let
      RQuintiles = [], // Quintiles of Recency
      FQuintiles = [], // Quintiles of Frequency
      MQuintiles = []; // Quintiles of Monetary


    // calculate quantiles for Recency
    const RElements = RDataSet.length;
    if(RElements < 3) {
      RQuintiles = calculateQuantiles(RDataSet, 2);
    }
    if(RElements > 2 && RElements < 4) {
      RQuintiles = calculateQuantiles(RDataSet, 3);
    }
    if(RElements > 3 && RElements < 5) {
      RQuintiles = calculateQuantiles(RDataSet, 4);
    }
    if(RElements >= 5) {
      RQuintiles = calculateQuantiles(RDataSet, 5);
    }

    // calculate quantiles for Frequency
    const FElements = FDataSet.length;
    if(FElements < 3) {
      FQuintiles = calculateQuantiles(FDataSet, 2);
    }
    if(FElements > 2 && FElements < 4) {
      FQuintiles = calculateQuantiles(FDataSet, 3);
    }
    if(FElements > 3 && FElements < 5) {
      FQuintiles = calculateQuantiles(FDataSet, 4);
    }
    if(FElements >= 5) {
      FQuintiles = calculateQuantiles(FDataSet, 5);
    }

    // calculate quantiles for Monetary
    const MElements = MDataSet.length;
    if(MElements < 3) {
      MQuintiles = calculateQuantiles(MDataSet, 2);
    }
    if(MElements > 2 && MElements < 4) {
      MQuintiles = calculateQuantiles(MDataSet, 3);
    }
    if(MElements > 3 && MElements < 5) {
      MQuintiles = calculateQuantiles(MDataSet, 4);
    }
    if(MElements >= 5) {
      MQuintiles = calculateQuantiles(MDataSet, 5);
    }

    return {RQuintiles, FQuintiles, MQuintiles};
  } catch(err) {
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
const indexRFMs = async({hits, source, dest, period, runDate, count}) => {
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
          ..._source,
          recency,
          frequency,
          monetary
        };
        await Elastic.index({index, type, id, body});
        count++;
      }));
    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFMs', err.message);
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
        elastic: {indices: {bots: botsIndex, rfm: rfmIndex}},
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

    /* Index */
    index = source.index;
    type = botsIndex.types.icare_member;
    body.size = batches;
    body._source = ["name", "gender", "company", "business_unit", "email", "phone"];

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    const {count: runCount} = await indexRFMs({hits, source, dest, period, runDate, count});
    count = runCount;
    scrollId = _scroll_id;
    while (count < total) {
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      const {count: runCount} = await indexRFMs({hits, source, dest, period, runDate, count});
      count = runCount;
      scrollId = _scroll_id;
    }

    return {count};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFM_MODEL', err.message);
  }
};