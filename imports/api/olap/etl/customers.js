import {Meteor} from 'meteor/meteor';
import moment from 'moment';

import {ETL} from '/imports/api/olap';
import scripts from './scripts';

const customers = ({country}) => {
  const
    runDate = new Date(), // running time
    {
      elastic: {indexPrefix: prefix},
      public: {env},
    } = Meteor.settings,
    suffix = moment(runDate).format('YYYY.MM.DD-HH.mm'), // elastic index suffix
    alias = `${prefix}_${country}_${env}`,
    indices = {
      base: {
        index: `icare_${env}_${country}`,
        types: {
          customer: 'b2b_customer',
          icare_member: 'customer',
          loan: 'm_client',
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
          customer: 'customer',
          business_unit: 'business_units',
          icare_member: 'icare_member',
          sales_order: 'sales_order',
          loan: 'loan',
        }
      },
    },
    {lang, bots: {
      customer: customersScripts, 
      icareMember: iCMsScripts,
      salesOrder: SOScripts,
      loan: loanScripts,
    }} = scripts;
  let
    actions = [],
    source = {},
    dest = {},
    script = {},
    options = {refresh: true, waitForCompletion: true};

  /**
   * Reindex basic info of customers, business units, icare members, sales orders
   */
  /* Customer*/
  actions = ['customer'];
  source = {
    index: indices.base.index,
    type: indices.base.types.customer
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.customer,
  };
  script = {
    lang,
    inline: Object.keys(customersScripts)
      .map(s => customersScripts[s])
      .join(';')
  };
  const reindexCustomers = ETL.reindex({actions, source, dest, script, options});

  /* Business units - basic info */
  /* Skip BUs
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
  */

  /* iCare member */
  actions = ['icare_member'];
  source = {
    index: indices.base.index,
    type: indices.base.types.icare_member,
    query: {
      bool: {
        must: [
          {
            exists: {
              field: "organization_id"
            }
          }
        ]
      }
    }
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.icare_member,
  };
  script = {
    lang,
    inline: Object.keys(iCMsScripts)
      .map(s => iCMsScripts[s])
      .join(';')
  };
  const reindexICMs = ETL.reindex({actions, source, dest, script, options});

  /* Sales Order */
  actions = ['sales_order'];
  source = {
    index: indices.etl.index,
    type: indices.etl.types.sales_order,
    query: {
      bool: {
        must: [
          {
            exists: {
              field: "magento_customer_id"
            }
          },
          {
            exists: {
              field: "netsuite_customer_id"
            }
          }
        ]
      }
    }
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.sales_order
  };
  script = {
    lang,
    inline: Object.keys(SOScripts)
      .map(s => SOScripts[s])
      .join(';')
  };
  const reindexSOs = ETL.reindex({actions, source, dest, script, options});

  /* Loan */
  actions = ['loan'];
  source = {
    index: indices.base.index,
    type: indices.base.types.loan,
    query: {
      bool: {
        must: [
          {
            exists: {
              field: "clientExternalId"
            }
          },
          {
            exists: {
              field: "orgId"
            }
          }
        ]
      }
    }
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.loan,
  };
  script = {
    lang,
    inline: Object.keys(loanScripts)
      .map(s => loanScripts[s])
      .join(';')
  };
  const reindexLoan = ETL.reindex({actions, source, dest, script, options});

  /**
   * ETL nested data into parents
   */
  /* iCare members - sales orders */
  // const etlSOs = ETL.etlSalesOrders({indices});

  /* iCare members - tickets */
  // const etlTicketsICMs = ETL.etlTicketsICMs({indices});

  /* iCare members - mifos */
  // const etlMifos = ETL.etlMifos({indices});

  /* Business units - iCare members */
  // const etlICMs = ETL.etlICMs({indices});

  /* Customers - Tickets */
  // cant import cause data in magento have no 
  // const etlTicketsCustomers = ETL.etlTicketsCustomers({indices});

  /* Customers - Business units */
  // const etlBusinessUnits = ETL.etlBusinessUnits({indices});


  // stdout
  console.log('----- indices -----');
  console.log('indices', JSON.stringify(indices, null, 2));

  console.log('----- reindex -----');
  console.log('reindexCustomers', JSON.stringify(reindexCustomers, null, 2));
  // console.log('reindexBUs', JSON.stringify(reindexBUs, null, 2));
  console.log('reindexICMs', JSON.stringify(reindexICMs, null, 2));
  console.log('reindexSOs', JSON.stringify(reindexSOs, null, 2));
  console.log('reindexLoan', JSON.stringify(reindexLoan, null, 2));

  const getAliasIndices = ETL.getAliasIndices({alias});
  let
    removes = [],
    adds = [];
  if (getAliasIndices.error) {
    console.log('getAliasIndices', ETL.getMessage(getAliasIndices.error), getAliasIndices.runTime);

  } else {
    removes = getAliasIndices.result.indices;
  }

  adds = [indices.new.index];

  console.log('updateAliases', ETL.getMessage({alias, removes, adds}));
  const updateAliases = ETL.updateAliases({alias, removes, adds});
  if(updateAliases.error) {
    console.log('updateAliases', ETL.getMessage(updateAliases.error), updateAliases.runTime);
  } else {
    console.log('updateAliases', ETL.getMessage(updateAliases.result), updateAliases.runTime);
  }

  /**
   * ETL addition fields
   */
  /* Customer - number_iCMs (calculate the number of iCare members) */
  actions = ['customer', 'number_iCMs'];
  source = {
    index: indices.new.index,
    type: indices.new.types.icare_member
  };
  dest = {
    index: indices.new.index,
    type: indices.new.types.customer,
  };
  script = {};
  const
    field = 'number_iCMs',
    calculator = ETL.calculateNumberICMs;
  const etlNumberICMs = ETL.etlField({actions, source, dest, field, calculator});

  console.log('----- ETL -----');
  console.log('etlNumberICMs', JSON.stringify(etlNumberICMs, null, 2));
  // console.log('addNumberICMs', JSON.stringify(addNumberICMs, null, 2));
  // console.log('etlTicketsICMs', JSON.stringify(etlTicketsICMs, null, 2));
  // console.log('etlMifos', JSON.stringify(etlMifos, null, 2));
  // console.log('etlICMs', JSON.stringify(etlICMs, null, 2));
  // console.log('etlTicketsCustomers', JSON.stringify(etlTicketsCustomers, null, 2));
  // console.log('etlBusinessUnits', JSON.stringify(etlBusinessUnits, null, 2));

};

export default customers

