import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import bodybuilder from 'bodybuilder';

// elastic
import {Elastic} from './';

/**
 * Function
 * @param country
 */
const migrateICareMembers = (country = 'kh') => {
  if(Meteor.isServer) {
    const
      runDate = new Date(),
      prefix = 'bots',
      {env} = Meteor.settings.public,
      suffix = moment(runDate).format('YYYY.MM.DD-HH.mm'),
      {Logger} = require('/imports/api/logger')
      ;

    /* Reindex iCare members*/
    const
      alias = `${prefix}_${country}_${env}`,
      source = {
        index: `icare_${env}_${country}`,
        // index: `bots_kh_stage`,
        type: 'customer',
      },
      dest = {
        index: `${prefix}_${country}_${env}-${suffix}`,
        type: 'icare_members',
      }
      ;
    try {
      const reindex = Elastic.reindex({
        waitForCompletion: true,
        body: {
          source,
          dest,
        }
      });

      /* Reindex customers */
      source.type = 'b2b_customer';
      dest.type = 'customers';
      try {
        const reindex = Elastic.reindex({
          refresh: true,
          waitForCompletion: true,
          body: {
            source,
            dest,
          }
        });

        /* get all clients to add into field loans of icare_members */
        const batch = 100; // should configurable in settings
        const
          {index} = source,
          type = 'm_client',
          body = {
            query: {
              match_all: {}
            },
            size: 0
          }
          ;
        try {
          const clients = Elastic.search({
            index,
            type,
            body,
          });

          const {hits: {total}} = clients;
          if (total > 0) {
            /* migrate index */
            for (let i = 0; i < total; i += batch) {
              // body._source = false;
              body.from = i;
              body.size = batch;

              try {
                const clients = Elastic.search({
                  index,
                  type,
                  body,
                });

                const {hits: {hits}} = clients;
                if (!_.isEmpty(hits)) {
                  hits.map(hit => {
                    const
                      {_id, _source} = hit,
                      {customerId} = _source
                      ;
                    try {
                      const addClient = Elastic.update({
                        index: dest.index,
                        type: 'icare_members',
                        id: customerId,
                        body: {
                          doc: {
                            mifos_client: _source
                          }
                        }
                      });
                    } catch (e) {
                      /* Failed */
                      Logger.error({name: "ADD_CLIENT", message: {customerId, error: JSON.stringify(e)}});
                      return {error: 'ADD_CLIENT_FAILED', message: {customerId, error: JSON.stringify(e)}};
                    }
                  });

                } else {
                  /* Failed */
                  Logger.error({name: "FETCH_CLIENTS", message: {error: JSON.stringify(e)}});
                  return {error: 'FETCH_CLIENTS_FAILED', message: {error: JSON.stringify(e)}};
                }
              } catch (e) {
                /* Failed */
                Logger.error({name: "GET_CLIENTS", message: {error: JSON.stringify(e)}});
                return {error: 'GET_CLIENTS_FAILED', message: {error: JSON.stringify(e)}};
              }
            }
          } else {
            /* Failed */
            Logger.error({name: "NO_CLIENTS_FOUND", message: {error: JSON.stringify(e)}});
            return {error: 'NO_CLIENTS_FOUND', message: {error: JSON.stringify(e)}};
          }

        } catch (e) {
          /* Failed */
          Logger.error({name: "COUNT_CLIENTS", message: {error: JSON.stringify(e)}});
          return {error: 'COUNT_CLIENTS_FAILED', message: {error: JSON.stringify(e)}};
        }

        /* get all of customers to add into field customer_info of icare_members */
        /* for every batch, create a bulk update query to update the icare_members */
        // action description
        // { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
        // the document to update
        // { doc: { title: 'foo' } },
        // try {
        //   // execute the bulk update
        //   // todo
        //
        // } catch (e) {
        //   console.log('BULK_UPDATE_CUSTOMER_FAILED', JSON.stringify(e, null, 2));
        //   /* Failed */
        //   // send to slack: `${new Date()} - FAILED - BULK_UPDATE_CUSTOMER_FAILED - INDEX: ${dest.index}`
        // }

        /* Apply new index */
        try {
          const currentAlias = Elastic.indices.getAlias({
            ignoreUnavailable: true,
            name: alias,
          });

          const
            preIndex = Object.keys(currentAlias)[0],
            newIndex = dest.index
            ;

          try {
            const updateAlias = Elastic.indices.updateAliases({
              body: {
                actions: [
                  {add: {index: newIndex, alias}},
                  {remove: {index: preIndex, alias}},
                ]
              }
            });

            /* Success */
            Logger.info({name: "MIGRATE_ICARE_MEMBERS", message: {index: dest.index, updateAlias}});
            return {error: 'MIGRATE_ICARE_MEMBERS_SUCCESS', message: {index: dest.index, updateAlias}};
          } catch (e) {
            /* Failed */
            Logger.error({name: "UPDATE_ALIAS", message: {error: JSON.stringify(e)}});
            return {error: 'UPDATE_ALIAS_FAILED', message: {error: JSON.stringify(e)}};
          }
        } catch (e) {
          if (!_.isEmpty(dest.index) && !_.isEmpty(alias)) {
            Logger.info({name: "CREATE_NEW_ALIAS", message: {index: dest.index, alias}});
            try {
              const createAlias = Elastic.indices.putAlias({
                index: dest.index,
                name: alias
              });

              /* Success */
              Logger.info({name: "MIGRATE_ICARE_MEMBERS", message: {index: dest.index, createAlias}});
              return {error: 'MIGRATE_ICARE_MEMBERS_SUCCESS', message: {index: dest.index, createAlias}};
            } catch (e) {
              /* Failed */
              Logger.error({name: "CREATE_NEW_ALIAS", message: {index: dest.index, error: JSON.stringify(e)}});
              return {error: 'CREATE_NEW_ALIAS_FAILED', message: {index: dest.index, error: JSON.stringify(e)}};
            }
          } else {
            /* Failed */
            Logger.error({name: "MIGRATE_ICARE_MEMBERS", message: {error: JSON.stringify(e)}});
            return {error: 'MIGRATE_ICARE_MEMBERS_FAILED', message: {error: JSON.stringify(e)}};
          }
        }

      } catch (e) {
        /* Failed */
        Logger.error({name: "REINDEX_CUSTOMERS", message: {error: JSON.stringify(e)}});
        return {error: 'REINDEX_CUSTOMERS_FAILED', message: {error: JSON.stringify(e)}};
      }
    } catch (e) {
      /* Failed */
      Logger.error({name: "REINDEX_ICARE_MEMBERS", message: {error: JSON.stringify(e)}});
      return {error: 'REINDEX_ICARE_MEMBERS_FAILED', message: {error: JSON.stringify(e)}};
    }
  }
};

const Functions = {
  migrateICareMembers,
};

export default Functions