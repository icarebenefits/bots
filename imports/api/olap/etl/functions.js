/**
 * ETL functions for bots Elastic index
 */
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';
import _ from 'lodash';
import {check} from 'meteor/check';

import {Logger} from '/imports/api/logger';
import {Elastic} from '../../elastic';

/**
 * Get etl action name
 * @param actions
 * @return {*|string|String}
 */
const getName = (actions) => {
  check(actions, Array);
  return actions.join('.');
};

/**
 * Function get run time in seconds
 * @param start
 * @return {String} run time in seconds
 */
const getRunTime = (start) => {
  const end = new Date();
  return accounting
    .formatNumber(Number(moment(end).diff(moment(start), 'seconds')));
};

/**
 *
 * @param data
 * @param unusedFields
 * @return {*}
 */
// const removeUnusedFields = ({data, unusedFields}) => {
//   const fields = data;
//   unusedFields.map(f => {
//     delete fields[f];
//   });
//   return fields;
// };

/**
 * get reponse message
 * @param mess
 * @return {JSON}
 */
const getMessage = (mess) => {
  return JSON.stringify(mess);
};

const handleResponse = (res, mess) => {
  const {error, result} = res;
  if (error) {
    /* Failed */
    // log into file
    Logger.error(error);
    if (mess) Logger.error(mess);
    // send notification (to slack or workplace)
    // todo
  } else {
    /* Success */
    // log into file
    Logger.info(result);
    if (mess) Logger.info(mess);
    // send notification (to slack or workplace)
    // todo
  }
};

/**
 * get the total documents of an Elastic query
 * @param actions
 * @param index
 * @param type
 * @param body
 * @return {{runTime: String}}
 */
// const getTotalDocuments = ({actions, index, type, body}) => {
//   const
//     name = getName(actions),
//     start = new Date();
//   let totalDocs = {};
//   try {
//     const {hits: {total}} = Elastic.search({
//       index,
//       type,
//       body,
//       size: 0,
//     });
//     totalDocs.result = {total}
//   } catch (e) {
//     totalDocs.error = {name, message: getMessage(e)};
//   }
//
//   const runTime = getRunTime(start);
//   handleResponse(totalDocs);
//   return {...totalDocs, runTime};
// };

/**
 * Elastic reindex
 * @param {Object} actions - [name ('customer', ...), type('general')]
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
// docs: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-reindex
const reindex = ({actions, source, dest, script, options}) => {
  const
    name = getName(actions),
    start = new Date();
  let
    params = {
      body: {
        source,
        dest
      }
    },
    reindex = {};

  !_.isEmpty(script) && (params.body.script = script);
  !_.isEmpty(options) && (params = {...params, ...options});

  try {
    const result = Elastic.reindex(params);
    reindex.result = {name, message: JSON.stringify(result)};
  } catch (e) {
    reindex.error = {name, message: JSON.stringify(e)};
  }

  const runTime = getRunTime(start);
  handleResponse(reindex, {runTime});
  return {...reindex, runTime};
};

/**
 * etl nested index into parent
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etl = ({actions, source, dest, key, field, removedFields, options = {batches: 1000}}) => {
  const
    name = getName(actions),
    start = new Date(),
    {batches} = options;

  // get total source docs
  const
    {index, type} = source,
    body = bodybuilder()
      .query('match_all', {})
      .size(0)
      .build();
  let
    totalSourceDocs = 0,
    stats = []
    ;
  try {
    const result = Elastic.search({index, type, body});
    totalSourceDocs = result.hits.total;
  } catch (e) {
    const
      runTime = getRunTime(start),
      res = {error: {name: getName([name, 'get_total_source_docs']), message: getMessage(e)}},
      mess = {runTime, message: getMessage({index, type, body})};
    handleResponse(res, mess);
  }

  if (totalSourceDocs <= 0) {
    // finish adding field cause no source documents found
    const
      runTime = getRunTime(start),
      result = {name: getName([name, 'no source docs found']), message: getMessage(stats)};
    return {result, runTime};
  }

  // get distinct list of key from source
  let keys = new Set(); // only store the uniq of key
  for (let i = 0; i < totalSourceDocs; i += batches) {
    body.from = i;
    body.size = batches;

    try {
      const {hits: {hits}} = Elastic.search({
        index,
        type,
        body,
      });

      hits.map(({_source}) => keys.add(_source[key]));
    } catch (e) {
      const
        runTime = getRunTime(start),
        res = {error: {name: getName([name, 'get_list_of_keys_from_source']), message: getMessage(e)}},
        mess = {runTime, message: getMessage({index, type, body})};
      handleResponse(res, mess);
    }
  }

  keys = Array.from(keys);
  if (_.isEmpty(keys)) {
    // finish adding field cause no source keys found
    const
      runTime = getRunTime(start),
      result = {name: getName([name, 'no source keys found']), message: getMessage(stats)};
    return {result, runTime};
  }

  // get source for every key
  keys.map(id => {
    // get all source's docs which match the dest id
    const
      {index, type} = source,
      body = bodybuilder()
        .query('term', key, id)
        .size(0)
        .build();
    let doc = {};

    try {
      const {hits: {total}} = Elastic.search({index, type, body,});

      doc[field] = [];
      for (let i = 0; i < total; i += batches) {
        body.from = i;
        body.size = batches;

        try {
          const {hits: {hits}} = Elastic.search({index, type, body});
          hits.map(({_source}) => {
            const src = _source;
            if (!_.isEmpty(removedFields)) {
              removedFields.map(f => {
                delete src[f];
              });
            }
            doc[field].push(src);
          });
        } catch (e) {
          const
            runTime = getRunTime(start),
            res = {error: {name: getName([name, `get_all_source_of_${id}`]), message: getMessage(e)}},
            mess = {runTime, message: getMessage({index, type, body})};
          handleResponse(res, mess);
        }
      }
    } catch (e) {
      const
        runTime = getRunTime(start),
        res = {error: {name: getName([name, `get_all_source_of_${id}`]), message: getMessage(e)}},
        mess = {runTime, message: getMessage({index, type, body})};
      handleResponse(res, mess);
    }

    // add total field
    doc[`total_${field}`] = doc[field].length;
    // add stats of field
    stats.push({[`${id}`]: doc[field].length});

    // add field into dest id
    try {
      const {index, type} = dest;

      const addField = Elastic.update({
        index,
        type,
        id: id,
        body: {doc}
      });

      const
        runTime = getRunTime(start),
        res = {result: {name: getName([name, `update/${id}`]), message: getMessage(addField)}},
        mess = {runTime, message: getMessage({index, type, body, doc})};
      handleResponse(res, mess);
    } catch (e) {
      const
        runTime = getRunTime(start),
        res = {error: {name: getName([name, `update/${id}`]), message: getMessage(e)}},
        mess = {runTime, message: getMessage({index, type, body, doc})};
      handleResponse(res, mess);
    }
  });

  return {result: {name, message: getMessage(stats)}};

};

/**
 * etl nested fields into parent
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlFields = ({actions, source, dest, key, fields, options = {batches: 1000}}) => {
  const
    name = getName(actions),
    start = new Date(),
    {batches} = options;

  // get total source docs
  const
    {index, type} = source,
    body = bodybuilder()
      .query('match_all', {})
      .size(0)
      .build();
  let
    totalSourceDocs = 0,
    stats = []
    ;
  try {
    const result = Elastic.search({index, type, body});
    totalSourceDocs = result.hits.total;
  } catch (e) {
    const
      runTime = getRunTime(start),
      res = {error: {name: getName([name, 'get_total_source_docs']), message: getMessage(e)}},
      mess = {runTime, message: getMessage({index, type, body})};
    handleResponse(res, mess);
  }

  if (totalSourceDocs <= 0) {
    // finish adding field cause no source documents found
    const
      runTime = getRunTime(start),
      result = {name: getName([name, 'no source docs found']), message: getMessage(stats)};
    return {result, runTime};
  }

  for (let i = 0; i < totalSourceDocs; i += batches) {
    body.from = i;
    body.size = batches;

    try {
      const {hits: {hits}} = Elastic.search({index, type, body});
      hits.map(({_source}) => {
        console.log(_source);
        const
          id = _source[key],
          doc = {};

        // get data for fields
        Object.keys(fields).map(f => {
          doc[f] = _source[fields[f]];
          // add total field
          // doc[`total_${f}`] = doc[f].length;
        });

        stats.push(id);

        // add fields into dest id
        try {
          const {index, type} = dest;
          const addFields = Elastic.update({
            index,
            type,
            id: id,
            body: {doc}
          });

          const
            runTime = getRunTime(start),
            res = {result: {name: getName([name, `update/${id}`]), message: getMessage(addFields)}},
            mess = {runTime, message: getMessage({index, type, body, doc})};
          handleResponse(res, mess);
        } catch (e) {
          const
            runTime = getRunTime(start),
            res = {error: {name: getName([name, `update/${id}`]), message: getMessage(e)}},
            mess = {runTime, message: getMessage({index, type, body, doc})};
          handleResponse(res, mess);
        }
      });
    } catch (e) {
      const
        runTime = getRunTime(start),
        res = {error: {name: getName([name, 'get_source_docs']), message: getMessage(e)}},
        mess = {runTime, message: getMessage({index, type, body})};
      handleResponse(res, mess);
    }
  }

  return {result: {name, message: getMessage(stats)}};

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlItems = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlShipment = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlSalesOrders = ({indices}) => {
  const
    start = new Date(),
    actions = ['icare_members', 'sales_orders'],
    source = {
      index: indices.new.index,
      type: indices.new.types.sales_orders,
    },
    dest = {
      index: indices.new.index,
      type: indices.new.types.icare_members,
    },
    key = 'magento_customer_id',
    field = 'sales_orders',
    removedFields = ['@timestamp', '@version', 'country', 'type'];

  const result = etl({actions, source, dest, key, field, removedFields});

  const runTime = getRunTime(start);
  handleResponse(result, {runTime});
  return {...result, runTime};

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlTicketsICMs = ({indices}) => {
  const
    start = new Date(),
    actions = ['icare_members', 'tickets'],
    source = {
      index: indices.etl.index,
      type: indices.etl.types.tickets_icare_members,
    },
    dest = {
      index: indices.new.index,
      type: indices.new.types.icare_members,
    },
    key = 'magento_customer_id',
    field = 'tickets',
    removedFields = ['@timestamp', '@version', 'country', 'type', 'from'];

  const result = etl({actions, source, dest, key, field, removedFields});

  const runTime = getRunTime(start);
  handleResponse(result, {runTime});
  return {...result, runTime};
};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlMifos = ({indices}) => {
  const
    start = new Date(),
    actions = ['icare_members', 'mifos'],
    source = {
      index: indices.base.index,
      type: indices.base.types.mifos,
    },
    dest = {
      index: indices.new.index,
      type: indices.new.types.icare_members,
    },
    key = 'clientExternalId',
    fields = {
      loans: 'loans',
      ddp: 'dpdInfo',
      saving: 'totalSavingBalance',
      due_installments: 'dueInstallments',
    };

  const result = etlFields({actions, source, dest, key, fields});

  const runTime = getRunTime(start);
  handleResponse(result, {runTime});
  return {...result, runTime};

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlICMs = ({indices}) => {
  const
    start = new Date(),
    actions = ['business_units', 'icare_members'],
    source = {
      index: indices.new.index,
      type: indices.new.types.icare_members,
    },
    dest = {
      index: indices.new.index,
      type: indices.new.types.business_units,
    },
    key = 'netsuite_business_unit_id',
    field = 'icare_members',
    removedFields = ['@timestamp', '@version', 'country', 'type', 'from'];

  const result = etl({actions, source, dest, key, field, removedFields});

  const runTime = getRunTime(start);
  handleResponse(result, {runTime});
  return {...result, runTime};
};

const etlTotalICMs = ({indices}) => {
  // get all customers
  
};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlTicketsCustomers = ({indices}) => {
  const
    start = new Date(),
    actions = ['customers', 'tickets'],
    source = {
      index: indices.etl.index,
      type: indices.etl.types.tickets_customers,
    },
    dest = {
      index: indices.new.index,
      type: indices.new.types.customers,
    },
    key = 'netsuite_customer_id',
    field = 'tickets',
    removedFields = ['@timestamp', '@version', 'country', 'type', 'from'];

  const result = etl({actions, source, dest, key, field, removedFields});

  const runTime = getRunTime(start);
  handleResponse(result, {runTime});
  return {...result, runTime};
};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlBusinessUnits = ({indices}) => {
  const
    start = new Date(),
    actions = ['customers', 'business_units'],
    source = {
      index: indices.new.index,
      type: indices.new.types.business_units,
    },
    dest = {
      index: indices.new.index,
      type: indices.new.types.customers,
    },
    key = 'netsuite_customer_id',
    field = 'business_units',
    removedFields = ['@timestamp', '@version', 'country', 'type'];

  const result = etl({actions, source, dest, key, field, removedFields});

  const runTime = getRunTime(start);
  handleResponse(result, {runTime});
  return {...result, runTime};
};

/**
 * get the indices name of a alias
 * @param {String} index - A comma-separated list of index names to filter aliases
 * @param {String} alias - A comma-separated list of alias names to return
 * @return {error, result, runTime}
 */
const getAliasIndices = ({index, alias}) => {
  const
    start = new Date(),
    name = `getAliasIndices.${alias}`;
  const
    res = {},
    params = {
      ignoreUnavailable: true,
      name: alias
    };

  if(index) params.index = index;

  try {
    const getIndices = Elastic.indices.getAlias(params);
    const indices = Object.keys(getIndices);
    res.result = {name, indices};
  } catch (e) {
    res.error = {name, message: getMessage(e)};
  }
  const runTime = getRunTime(start);
  return {...res, runTime};
};

/**
 *
 * @param {String} alias
 * @param {Array} removes - list of removed indices
 * @param {Array} adds - list of added indices
 * @return {error, result, runTime}
 */
const updateAliases = ({alias, removes, adds}) => {
  const
    start = new Date(),
    name = `updateAliases`;
  const
    res = {},
    body = {
      actions: []
    };

  // add removed indices
  removes.map(index => {
    body.actions.push({remove: {index, alias}});
  });
  // add new indices
  adds.map(index => {
    body.actions.push({add: {index, alias}});
  });

  try {
    const updateAlias = Elastic.indices.updateAliases({body});
    res.result = {name, updateAlias};
  } catch (e) {
    res.error = {name, message: getMessage(e)};
  }
  const runTime = getRunTime(start);
  return {...res, runTime};
};

const ETL = {
  reindex,
  etl,
  etlItems,
  etlShipment,
  etlSalesOrders,
  etlTicketsICMs,
  etlMifos,
  etlICMs,
  etlBusinessUnits,
  etlTicketsCustomers,
  getAliasIndices,
  getMessage,
  updateAliases,
};

export default ETL


