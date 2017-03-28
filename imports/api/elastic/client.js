import elastic from 'elasticsearch';
import {Async} from 'meteor/meteorhacks:async';
import {Meteor} from 'meteor/meteor';

const {host, region, accessKey, secretKey} = Meteor.settings.elastic;
const config = {
  host,
  connectionClass: require('http-aws-es'),
  amazonES: {
    region,
    accessKey,
    secretKey,
  },
  apiVersion: '5.0',
};

export const ClientRaw = new elastic.Client(config);

if (!config.clientFunctions) {
  config.clientFunctions = [];
}

// ensure basic CRUD functions are there
_.each(['index', 'update', 'search', 'reindex', 'bulk'], function (fnName) {
  if (-1 === config.clientFunctions.indexOf(fnName)) {
    config.clientFunctions.push(fnName);
  }
});

const Elastic = Async.wrap(ClientRaw, config.clientFunctions);

// wrap the inner functions from Elastic client
// Ex: indices.validateQuery or indices.open, ....
Elastic.indices = {
  validateQuery: Meteor.wrapAsync(ClientRaw.indices.validateQuery, ClientRaw),
  open: Meteor.wrapAsync(ClientRaw.indices.open, ClientRaw)
};

export default Elastic