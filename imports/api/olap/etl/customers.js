import {Meteor} from 'meteor/meteor';
import moment from 'moment';
// import _ from 'lodash';

import {ETL} from '/imports/api/olap';
import scripts from './scripts';
import {FbRequest} from '/imports/api/facebook-graph';

const customers = ({country}) => {
    const
      runDate = new Date(), // running time
      {
        elastic: {indexPrefix: prefix},
        public: {env},
        facebook: {personalId, adminWorkplace}
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
          index: `etl_${alias}`,
          types: {
            business_units: 'business_unit',
            sales_order: 'sales_order',
            items: 'item',
            shipment: 'shipment',
            ticket_customer: 'ticket_customer',
            ticket_icare_member: 'ticket_icare_member',
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
            ticket: 'ticket',
          }
        },
      },
      {
        lang, bots: {
        customer: customersScripts,
        icareMember: iCMsScripts,
        salesOrder: SOScripts,
        loan: loanScripts,
        ticket: ticketScripts,
      }
      } = scripts;
    let
      actions = [],
      source = {},
      dest = {},
      script = {},
      options = {refresh: true, waitForCompletion: true},
      message = `# ETL - Index: ${alias} - on ${moment(runDate).format('LLL')}`;

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
    actions = ['sales_order', 'icare_member'];
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


    /* Ticket */
    actions = ['ticket', 'icare_member'];
    source = {
      index: indices.etl.index,
      type: indices.etl.types.ticket_icare_member,
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
      type: indices.new.types.ticket,
    };
    script = {
      lang,
      inline: Object.keys(ticketScripts)
        .map(s => ticketScripts[s])
        .join(';')
    };
    const reindexTicket = ETL.reindex({actions, source, dest, script, options});

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

    message = `${message} \n ## Indices information`;
    message = `${message} \n \`\`\`${JSON.stringify(indices, null, 2)} \n \`\`\``;
    message = `${message} \n ## Progress `;
    message = `${message} \n **Customer** \n \`\`\` \n ${JSON.stringify({
      name: reindexCustomers.error ? reindexCustomers.error.name : reindexCustomers.result.name,
      total: (reindexCustomers.result.message) && JSON.parse(reindexCustomers.result.message).total,
      runtime: reindexCustomers.runTime
    }, null, 2)} \n \`\`\``;
    message = `${message} \n **iCare Member** \n\`\`\` \n ${JSON.stringify({
      name: reindexICMs.error ? reindexICMs.error.name : reindexICMs.result.name,
      total: (reindexICMs.result.message) && JSON.parse(reindexICMs.result.message).total,
      runtime: reindexICMs.runTime
    }, null, 2)} \n \`\`\``;
    message = `${message} \n **iCM Sales Order** \n\`\`\` \n ${JSON.stringify({
      name: reindexSOs.error ? reindexSOs.error.name : reindexSOs.result.name,
      total: (reindexSOs.result.message) && JSON.parse(reindexSOs.result.message).total,
      runtime: reindexSOs.runTime
    }, null, 2)} \n \`\`\``;
    message = `${message} \n **iCM Loan** \n\`\`\` \n ${JSON.stringify({
      name: reindexLoan.error ? reindexLoan.error.name : reindexLoan.result.name,
      total: (reindexLoan.result.message) && JSON.parse(reindexLoan.result.message).total,
      runtime: reindexLoan.runTime
    }, null, 2)} \n \`\`\``;
    message = `${message} \n **iCM Ticket** \n\`\`\` \n ${JSON.stringify({
      name: reindexTicket.error ? reindexTicket.error.name : reindexTicket.result.name,
      total: (reindexTicket.result.message) && JSON.parse(reindexTicket.result.message).total,
      runtime: reindexTicket.runTime
    }, null, 2)} \n \`\`\``;

    const getAliasIndices = ETL.getAliasIndices({alias});
    let
      removes = [],
      adds = [];
    if (getAliasIndices.error) {

      message = `${message} \n ### Waring - Get Bots Elastic Alias \n \`\`\` \n ${JSON.stringify({
        warning: getAliasIndices.error,
        runtime: getAliasIndices.runTime
      }, null, 2)} \n \`\`\` **`;
    } else {
      removes = getAliasIndices.result.indices;
    }

    adds = [indices.new.index];

    message = `${message} \n **Update Bots Elastic Alias** \n \`\`\` \n ${JSON.stringify({
      alias,
      removes,
      adds
    }, null, 2)} \n \`\`\``;

    const updateAliases = ETL.updateAliases({alias, removes, adds});
    if (updateAliases.error) {
      message = `${message} \n ### Error - Update Bots Elastic Alias \n \`\`\` \n ${JSON.stringify({
        error: updateAliases.error,
        runtime: updateAliases.runTime
      }, null, 2)} \n \`\`\` **`;
    } else {
      message = `${message} \n ### Success - Update Bots Elastic Alias \n \`\`\` \n ${JSON.stringify({
        result: updateAliases.result.name,
        runtime: updateAliases.runTime
      }, null, 2)} \n \`\`\``;
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

    message = `${message} \n **ETL Additional Fields**`;
    message = `${message} \n \`\`\` \n ${JSON.stringify({
      name: etlNumberICMs.error ? etlNumberICMs.error.name : etlNumberICMs.result.name,
      total: JSON.parse(etlNumberICMs.result.message).total,
      runtime: etlNumberICMs.runTime
    }, null, 2)} \n \`\`\``;

    message = `${message} \n **Powered by** [iCare-bots](${Meteor.settings.public.domain})`;
    /* Post ETL result to admin workplace */
    const wpRequest = new FbRequest();
    wpRequest.post(personalId, adminWorkplace, message);
  }
  ;

export default customers

