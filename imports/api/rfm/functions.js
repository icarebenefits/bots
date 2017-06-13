import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import {Promise} from 'meteor/promise';

/* Elastic */
import {ElasticClient as Elastic} from '/imports/api/elastic';
/* Utils */
import {getIndexSuffix} from '/imports/utils';

/**
 * Function calculate Recency, Frequency, Monetary of a user in a period - server
 * @param {String} index - Ex: "bots_vn_stage"
 * @param {String} type - Ex: "sales_order"
 * @param {String} _id - Ex: ""
 * @param {String} period - Ex: "now-1y"
 * @returns {recency, frequency, monetary}
 */
export const calculateRFMScore = async({index, type, id, period, runDate}) => {
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

const indexRFMs = async({hits, source, dest, period, runDate, count}) => {
  try {
    let index = '', type = '';
    await Promise.all(hits.map(
      async hit => {
        index = source.index;
        type = source.type;
        const {_id: id, _source} = hit;
        const {recency, frequency, monetary} = await calculateRFMScore({index, type, id, period, runDate});
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
    let index = '', type = '',
      scrollId = '';

    /* Index */
    // get all iCare members who have sales orders
    let body = bodybuilder()
      .query('has_child', {type: source.type}, (q) => {
        return q
          .filter('range', 'purchase_date', {gte: period})
          .query('exists', 'field', 'magento_customer_id')
      })
      .build();

    index = source.index;
    type = botsIndex.types.icare_member;
    body.size = batches;
    body._source = ["name", "gender", "company", "business_unit", "email", "phone"];

    let count = 0;
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