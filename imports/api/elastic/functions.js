import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import bodybuilder from 'bodybuilder';

// elastic
import {Elastic} from './';

const migrateICareMembers = (country = 'kh') => {
  const
    runDate = new Date(),
    prefix = 'bots',
    {env} = Meteor.settings.public,
    suffix = moment(runDate).format('YYYY.MM.DD-HH.mm')
    ;

  /* Reindex iCare members*/
  const
    source = {
      index: `icare_${env}_${country}`,
      // index: `bots_kh_stage`,
      type: 'customer',
    },
    dest = {
      index: `${prefix}-${country}-${env}-${suffix}`,
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

    // reindexing success
    // send result to slack
    // console.log('reindex iCM success', reindex);
    // console.log('new index', dest.index);

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

      // reindexing success
      // send result to slack
      // console.log('reindex iCM success', reindex);
      // console.log('new index', dest.index);

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
        // console.log('clients', JSON.stringify(clients, null, 2));

        const {hits: {total}} = clients;
        if (total > 0) {
          // get list of _id
          for (let i = 0; i < total; i += batch) {
            // body._source = false;
            body.from = i;
            body.size = batch;

            // console.log('get clients', JSON.stringify(body, null, 2));
            try {
              const clients = Elastic.search({
                index,
                type,
                body,
              });

              const {hits: {hits}} = clients;
              if (!_.isEmpty(hits)) {
                const bulk = [];
                hits.map(hit => {
                  const
                    {_id, _source} = hit,
                    {customerId} = _source
                    ;
                  try {
                    const addLoans = Elastic.update({
                      index: dest.index,
                      type: 'icare_members',
                      id: customerId,
                      body: {
                        doc: {
                          loans: _source
                        }
                      }
                    });
                  } catch (e) {
                    console.log('ADD_LOANS_FAILED', {customerId, error: JSON.stringify(e, null, 2)});
                    /* Failed */
                    // send to slack: `${new Date()} - FAILED - NO_CLIENTS_FOUND - INDEX: ${dest.index}`
                  }
                });

              } else {
                console.log('NO_CLIENTS_FETCHED', JSON.stringify(e, null, 2));
                /* Failed */
                // send to slack: `${new Date()} - FAILED - NO_CLIENTS_FOUND - INDEX: ${dest.index}`
              }
            } catch (e) {
              console.log('GET_CLIENTS_FAILED', JSON.stringify(e, null, 2));
              /* Failed */
              // send to slack: `${new Date()} - FAILED - NO_CLIENTS_FOUND - INDEX: ${dest.index}`
            }
          }
        } else {
          console.log('NO_CLIENTS_FOUND', JSON.stringify(e, null, 2));
          /* Failed */
          // send to slack: `${new Date()} - FAILED - NO_CLIENTS_FOUND - INDEX: ${dest.index}`
        }

      } catch (e) {
        console.log('GET_CLIENTS_FAILED', JSON.stringify(e, null, 2));
        /* Failed */
        // send to slack: `${new Date()} - FAILED - GET_CLIENTS_FAILED - INDEX: ${dest.index}`
      }

      /* for every batch, create a bulk update query to update the icare_members */
      // action description
      // { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
      // the document to update
      // { doc: { title: 'foo' } },
      try {
        // execute the bulk update
        // todo

      } catch (e) {
        console.log('BULK_UPDATE_LOANS_FAILED', JSON.stringify(e, null, 2));
        /* Failed */
        // send to slack: `${new Date()} - FAILED - BULK_UPDATE_LOANS_FAILED - INDEX: ${dest.index}`
      }


      /* get all of customers to add into field customer_info of icare_members */

      /* for every batch, create a bulk update query to update the icare_members */
      // action description
      // { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
      // the document to update
      // { doc: { title: 'foo' } },
      try {
        // execute the bulk update
        // todo

      } catch (e) {
        console.log('BULK_UPDATE_CUSTOMER_FAILED', JSON.stringify(e, null, 2));
        /* Failed */
        // send to slack: `${new Date()} - FAILED - BULK_UPDATE_CUSTOMER_FAILED - INDEX: ${dest.index}`
      }


      /* Success */
      // send to slack: `${new Date()} - SUCCESS - MIGRATE_ICARE_MEMBERS - INDEX: ${dest.index}`

      /* Failed */
      // send to slack: `${new Date()} - FAILED - MIGRATE_ICARE_MEMBERS - INDEX: ${dest.index}`

    } catch (e) {
      console.log('REINDEX_CUSTOMERS_FAILED', JSON.stringify(e, null, 2));
      /* Failed */
      // send to slack: `${new Date()} - FAILED - REINDEX_CUSTOMERS_FAILED - INDEX: ${dest.index}`
    }
  } catch (e) {
    console.log('REINDEX_iCMs_FAILED', JSON.stringify(e, null, 2));
    /* Failed */
    // send to slack: `${new Date()} - FAILED - REINDEX_iCMs_FAILED - INDEX: ${dest.index}`
  }

};

const Functions = {
  migrateICareMembers,
};

export default Functions