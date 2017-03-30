// Elastic client which could be used in client side
export {ClientRaw as ElasticClient} from './client';
// wrapped Elastic client to be used in Meteor server side
export {default as Elastic} from './client';
// Functions
export {default as ESFuncs} from './functions';