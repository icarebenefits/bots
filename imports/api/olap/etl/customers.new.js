import {Meteor} from 'meteor/meteor';
import moment from 'moment';

import {ETL} from '/imports/api/olap';
import scripts from './scripts';

const customers = ({country}) => {
  const
    runDate = new Date(), // running time
    {
      elastic: {indexPrefix: prefix, migration: {batches}},
      public: {env},
    } = Meteor.settings,
    suffix = moment(runDate).format('YYYY.MM.DD-HH.mm'), // elastic index suffix
    alias = `${prefix}_${country}_${env}`,
    indices = {
      base: {
        index: `icare_${env}_${country}`,
        types: {
          customers: 'b2b_customer',
          icare_members: 'customer',
          mifos: 'm_client',
        }
      },
      etl: {
        index: `${alias}_etl`,
        types: {
          business_units: 'business_units',
          sales_orders: 'sales_orders',
          items: 'items',
          shipment: 'shipment',
          tickets_customers: 'tickets_customers',
          tickets_icare_members: 'tickets_icare_members',
        }
      },
      new: {
        index: `${alias}-${suffix}`,
        types: {
          customers: 'customers',
          business_units: 'business_units',
          icare_members: 'icare_members',
          sales_orders: 'sales_orders',
        }
      },
    },
    {lang, bots: {customers: customersScripts, icareMembers: iCMsScripts}} = scripts;
  let
    actions = [],
    source = {},
    dest = {},
    script = {},
    options = {refresh: true, waitForCompletion: true};

  /* Customers - basic info */
  actions = ['customers', 'basic'];
  source = {
    index: indices.base.index,
    type: indices.base.types.customers
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.customers,
  };
  script = {
    lang,
    inline: Object.keys(customersScripts)
      .map(s => customersScripts[s])
      .join(';')
  };
  const reindexCustomers = ETL.reindex({actions, source, dest, script, options});

  /* Business units - basic info */
  actions = ['business_units', 'basic'];
  source = {
    index: indices.etl.index,
    type: indices.etl.types.business_units
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.business_units,
  };
  script = {};
  const reindexBUs = ETL.reindex({actions, source, dest, script, options});

  /* iCare members - basic info */
  actions = ['icare_members', 'basic'];
  source = {
    index: indices.base.index,
    type: indices.base.types.icare_members
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.icare_members,
  };
  script = {
    lang,
    inline: Object.keys(iCMsScripts)
      .map(s => iCMsScripts[s])
      .join(';')
  };
  const reindexICMs = ETL.reindex({actions, source, dest, script, options});

  /* Sales Orders - basic info */
  actions = ['sales_orders', 'basic'];
  source = {
    index: indices.etl.index,
    type: indices.etl.types.sales_orders
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.sales_orders,
  };
  script = {};
  const reindexSOs = ETL.reindex({actions, source, dest, script, options});

  // stdout
  console.log('indices', JSON.stringify(indices, null, 2));
  console.log('reindexCustomers', JSON.stringify(reindexCustomers, null, 2));
  console.log('reindexBUs', JSON.stringify(reindexBUs, null, 2));
  console.log('reindexICMs', JSON.stringify(reindexICMs, null, 2));
  console.log('reindexSOs', JSON.stringify(reindexSOs, null, 2));

};

export default customers

