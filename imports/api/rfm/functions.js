import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import _ from 'lodash';

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
export const calculateRFMScore = async({index, type, magento_customer_id, period, runDate}) => {
  check(index, String);
  check(type, String);
  check(magento_customer_id, Match.OneOf(Number, String));
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
        .filter('term', key, magento_customer_id)
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

export const indexRFMModel = async({country}) => {
  check(country, String);

  try {
    const
      runDate = new Date(),
      {
        elastic: {indices: {bots: botsIndex, rfm: rfmIndex}},
        public: {env, elastic: {batches, scroll}}
      } = Meteor.settings,
      source = {
        index: `${botsIndex.prefix}_${country}_${env}`,
        type: botsIndex.types.sales_order
      },
      dest = {
        index: `${rfmIndex.prefix}_${country}_${env}`,
        type: rfmIndex.types.year
      },
      period = rfmIndex.periods.year,
      {suffix} = getIndexSuffix(runDate, 'day');
    let index = '', type = '',
      scrollId = '',
      iCMList = []; // list of iCare member who have sales orders

    /* Index */
    // get all iCare members who have sales orders
    let body = bodybuilder()
      .query('has_child', {type: source.type}, (q) => {
        return q
          .query('exists', 'field', 'magento_customer_id')
      })
      .build();
    
    index = source.index;
    type = botsIndex.types.icare_member;
    body.size = batches;
    body._source = false; // no need to receive the source document

    const {hits: {hits, total}, _scroll_id} = await Elastic.search({index, type, scroll, body});
    hits.forEach(hit => iCMList.push(hit._id));
    scrollId = _scroll_id;
    let count = 0;
    while(iCMList.length < total) {
      console.log('iCMList', iCMList.length);
      const {hits: {hits}, _scroll_id} = await Elastic.scroll({scrollId, scroll});
      hits.forEach(hit => iCMList.push(hit._id));
      scrollId = _scroll_id;
      count++;
    }




    // console.log('source', source);
    // console.log('dest', dest);
    // console.log('period', period);
    // console.log('suffix', suffix);
    // console.log('totalICMs', iCMList);

    return {iCMList: iCMList.length};
  } catch (err) {
    throw new Meteor.Error('INDEX_RFM_MODEL', err.message);
  }
};