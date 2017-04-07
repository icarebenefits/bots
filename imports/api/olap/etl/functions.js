/**
 * ETL functions for bots Elastic index
 */
import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';

import {Logger} from '/imports/api/logger';
import {Elastic} from '../../elastic';
import scripts from './scripts';
const {batches} = Meteor.settings.elastic.migration;

/**
 * Get etl action name
 * @param actions
 * @return {*|string|String}
 */
const getName = (actions) => {
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
const removeUnusedFields = ({data, unusedFields}) => {
  const fields = data;
  unusedFields.map(f => {
    delete fields[f];
  });
  return fields;
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
  } finally {
    const 
      {error, result} = reindex,
      runTime = getRunTime(start);
    if(error) {
      /* Failed */
      // log into file
      Logger.error(error);
      // send notification (to slack or workplace)
      // todo

      return {error};
    } else {
      /* Success */
      // log into file
      Logger.info(result);
      // send notification (to slack or workplace)
      // todo

      return {result};
    }
  }
};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etl = ({actions}) => {
  const name = getName(actions);
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
const etlSalesOrders = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlTicketsICMs = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlMifos = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlICMs = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlBusinessUnits = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlTicketsCustomers = () => {

};

/**
 *
 * @param {Object} source {index, type}
 * @param {Object} dest {index, type}
 * @param {Object} script {lang, inline}
 * @param {Object} options {}
 * @return {Object} error | result
 */
const etlCustomers = () => {

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
  etlCustomers,
};

export default ETL


