/**
 * ETL functions for bots Elastic index
 */
import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';
import _ from 'lodash';
import {check} from 'meteor/check';
import {Promise} from 'meteor/promise';

import {Logger} from '/imports/api/logger';
// import {Elastic} from '../../elastic';
import {ElasticClient as Elastic} from '../../elastic';

/* CONSTANTS */
const {debug, CHECK_LIMIT, secondSleep} = Meteor.settings.elastic.reindex;

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
 * Verify the reindex process is finished
 * @param index
 * @param type
 * @param total
 * @param created
 * @param COUNT
 * @return {*}
 */
const isReindexFinish = async({index, type, total, created = 0, COUNT = 0}) => {
  let result = {runTimes: COUNT, total, created};

  /* Verify reindex task */
  const {nodes} = await Elastic.tasks.list({detailed: true, actions: '*reindex'});
  /* No task, indexing finished */
  if (_.isEmpty(nodes)) {
    return {...result, finish: true};
  }

  /* Task exists --> indexing running */
  try {
    const {count: current} = await Elastic.count({index, type, body: {query: {match_all: {}}}});
    result = {...result, current};
    debug && console.log(`isReindexFinished.${COUNT}`, {result});

    if (total === current || total <= current) {
      /* Number document of dest index is equal to source index --> indexing finished */
      return result;
    } else if (current >= created && current < total) {
      if (COUNT === CHECK_LIMIT) {  // total check time is not over 3 hours (CHECK_LIMIT * millisecondSleep) ms
        debug && console.log('REACH CHECK_LIMIT', COUNT);
        /* Number of check times is greater than CHECK_LIMIT --> indexing failed */
        throw new Meteor.Error('IS_REINDEX_FINISHED', {
          detail: result,
          runTimes: `CHECK_LIMIT is reached ${CHECK_LIMIT}!`
        });
      }
      /* Log the listening process */
      if (COUNT === 0) {
        debug && console.log('start listener', new Date());
      } else {
        debug && console.log(`listener run on ${COUNT} times`, new Date());
      }

      Meteor.sleep(secondSleep * 1000); // sleep server in secondSleep seconds
      COUNT++;
      try {
        const res = await isReindexFinish({index, type, total, created: current, COUNT});
        debug && console.log(`IS_REINDEX_FINISH.${COUNT}.RESPONSE`, res);
        return res;
      } catch (e) {
        throw new Meteor.Error('IS_REINDEX_FINISHED', {detail: e, runTimes: COUNT});
      }
    } else {
      debug && console.log('else', {total, current, created});
      throw new Meteor.Error('IS_REINDEX_FINISHED.ERROR', {detail: result, runTimes: COUNT});
    }
    // return result;
  } catch (e) {
    throw new Meteor.Error('IS_REINDEX_FINISHED', {detail: e, runTimes: COUNT});
  }
};

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
      refresh: true,
      waitForCompletion: true,
      timeout: '10m',
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

const asyncReindex = async({source, dest, script, options}) => {
  try {
    /* Get total source documents */
    const {index, type} = source;
    const {count: total} = await Elastic.count({index, type, body: {query: {match_all: {}}}});
    debug && console.log('total', total);
    /* Reindex source index */
    let created = 0;
    const reindexResult = await Elastic.reindex({...options, ignore: [408, 504, 400], body: {source, dest, script}});
    debug && console.log('reindexResult', reindexResult);
    if (reindexResult) {
      created = reindexResult.created || 0;
    }
    /* Verify reindex process is finished */
    const isFinished = await isReindexFinish({index: dest.index, type: dest.type, total, created});
    debug && console.log('isFinished', isFinished);
    return isFinished;
  } catch (err) {
    throw new Meteor.Error('REINDEX', err.message);
  }
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
/*
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
*/
/**
 * Add a field has data calculated by calculator on source index into dest index
 * @param {Array} actions
 * @param {Object} source - {index, type, ...options}
 * @param {Object} dest - {index, type, ...options}
 * @param {String} field - field name
 * @param {Object} options - ex: batches: 1000,
 *                         - mode: 0 or undefined - add field by loop on dest,
 *                                 1 - add field by loop on source
 * @param {Func} calculator(index, id) - function execute calculation for value of field
 * @return {*}
 */
const etlField = async({source, dest, field, options = {batches: 1000, mode: 0, _source: false}}) => {
  try {
    const {batches = 1000, mode = 0, _source = false} = options;
    // get total dest docs
    const
      body = bodybuilder()
        .query('match_all', {})
        .build();
    let updated = [], failed = [],
      index = '', type = '';

    switch (mode) {
      case 0:
      {
        index = dest.index;
        type = dest.type;
        break;
      }
      case 1:
      {
        index = source.index;
        type = source.type;
        break;
      }
      default:
      {
        index = dest.index;
        type = dest.type;
      }
    }

    const {count: total} = await Elastic.count({index, type, body});
    for (let i = 0; i < total; i += batches) {
      body.from = i;
      body.size = batches;
      body._source = _source;

      const {hits: {hits}} = await Elastic.search({index, type, body});
      await Promise.all(hits.map(async(document) => {
        const {_id} = document;
        // calculate field value
        let value, parent;
        switch (field) {
          case 'number_iCMs':
          {
            const result = await countNumberICMs(source, _id);
            const {numberICMs} = result;
            value = numberICMs;
            break;
          }
          case 'is_activated':
          {
            const {parent: iCMParent} = await getICMParent(dest, _id);
            value = document._source[field];
            parent = iCMParent;
            break;
          }
        }

        const doc = {
          [`${field}`]: value
        };

        // add field into dest
        const {index, type} = dest;
        const updateBody = {
          index,
          type,
          id: _id,
          body: {doc}
        };
        let addField;
        if (parent) {
          if (parent !== -1) {  // only update the document has parent
            updateBody.parent = parent;
            addField = await Elastic.update(updateBody);
          } else {
            failed.push({[`${_id}`]: value});
          }
        } else {
          addField = await Elastic.update(updateBody);
        }
        updated.push({[`${_id}`]: value, addField});
      }));
    }

    debug && console.log('ETL_ADDITIONAL_FIELD.UPDATED', updated);
    debug && console.log('ETL_ADDITIONAL_FIELD.FAILED', failed);

    return {total, updated: updated.length, failed: failed.length};
  } catch (err) {
    throw new Meteor.Error('ETL_ADDITIONAL_FIELD', {detail: err.message});
  }
};

/**
 * get the indices name of a alias
 * @param {String} index - A comma-separated list of index names to filter aliases
 * @param {String} alias - A comma-separated list of alias names to return
 * @return {error, result, runTime}
 */
const getAliasIndices = async({index, alias}) => {
  const params = {
      ignoreUnavailable: true,
      ignore: [404],
      name: alias
    };

  if (index) params.index = index;

  try {
    let indices = [];
    const getIndices = await Elastic.indices.getAlias(params);
    if (!getIndices.error) {
      indices = Object.keys(getIndices);
    }
    return {indices};
  } catch (e) {
    throw new Meteor.Error('GET_ALIAS_INDICES', {detail: e});
  }
};

/**
 *
 * @param {String} alias
 * @param {Array} removes - list of removed indices
 * @param {Array} adds - list of added indices
 * @return {error, result, runTime}
 */
const updateAliases = async({alias, removes, adds}) => {
  const body = {
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
    const updateAlias = await Elastic.indices.updateAliases({body});
    return updateAlias;
  } catch (e) {
    throw new Meteor.Error('UPDATE_ALIASES', {detail: e});
  }
};

const deleteIndices = ({indices}) => {
  const
    start = new Date(),
    name = `deleteIndices`;
  const res = {};


  try {
    const deleteIndices = Elastic.indices.delete({index: indices});
    res.result = {name, deleteIndices};
  } catch (e) {
    res.error = {name, message: getMessage(e)};
  }
  const runTime = getRunTime(start);
  return {...res, runTime};
};

/**
 * Calculate the number of iCare members from netsuite_customer_id
 * @param source
 * @param netsuite_customer_id
 * @return {{}}
 */
const countNumberICMs = async(source, netsuite_customer_id) => {
  const
    {index, type} = source,
    body = bodybuilder()
      .query('term', 'netsuite_customer_id', netsuite_customer_id)
      .query('term', 'inactivate', false)
      .build();
  try {
    let numberICMs = 0;
    // const {count} = await Elastic.count({index, type, body});
    const result = await Elastic.count({index, type, body});

    // console.log('netsuite_customer_id', netsuite_customer_id);
    // console.log('countNumberICMs', JSON.stringify({index, type, body}, null, 2));
    // console.log('result', result);
    if(result.count) {
      numberICMs = result.count;
    }
    return {numberICMs};
  } catch (err) {
    throw new Meteor.Error('COUNT_NUMBER_ICM', err.message);
  }
};

const getICMParent = async(dest, magento_customer_id) => {
  const
    {index, type} = dest,
    body = bodybuilder()
      .query('term', 'magento_customer_id', magento_customer_id)
      .build();

  body._source = false;

  try {
    const {hits} = await Elastic.search({index, type, body});
    if (!_.isEmpty(hits)) {
      const {hits: docs} = hits;
      let parent = -1;
      if (!_.isEmpty(docs)) {
        parent = docs[0]._parent;
      }
      return {parent};
    }
  } catch (err) {
    throw new Meteor.Error('GET_ICM_PARENT', err.message);
  }
};

const Functions = () => ({
  getMessage,
  getRunTime,
  reindex,
  asyncReindex,
  etl,
  etlField,
  getAliasIndices,
  updateAliases,
  deleteIndices,
  countNumberICMs,
  getICMParent
});

export default Functions


