import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import moment from 'moment';

/* Functions */
import {Functions} from '../';
import {formatMessage} from '/imports/utils/defaults';

/* Scripts */
import Scripts from './scripts';


const checkReindexFinish = (taskId) => {
};

const ETL = (country) => {
  check(country, String);

  return {
    customer: async() => {
      const
        runDate = new Date(), // running time
        {
          elastic: {indexPrefix: prefix, reindex: {debug}},
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
              sales_order: 'sales_order',
              ticket_icare_member: 'ticket_icare_member',
            }
          },
          new: {
            index: `${alias}-${suffix}`,
            types: {
              customer: 'customer',
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
        } = Scripts();
      let
        actions = [],
        source = {},
        dest = {},
        script = {},
        options = {refresh: true, waitForCompletion: true, requestTimeout: 120000},
        message = formatMessage({

          heading1: `ETL - Index: ${alias} - on ${moment(runDate).format('LLL')}`
        });


      try {
        /* Reindex Customer */
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
        debug && console.log('dest', dest);
        const reindexCustomer = await Functions().asyncReindex({actions, source, dest, script, options});
        debug && console.log('reindexCustomer', reindexCustomer);

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
        debug && console.log('dest', dest);
        const reindexICM = await Functions().asyncReindex({actions, source, dest, script, options});
        debug && console.log('reindexICM', reindexICM);

        /* Parallel reindex icare_member child and additional fields */
        /* Sales Order */
        actions = ['icare_member', 'sales_order'];
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
        debug && console.log('dest', dest);
        const reindexSO = await Functions().asyncReindex({actions, source, dest, script, options});
        debug && console.log('reindexSO', reindexSO);

        /* Loan */
        actions = ['icare_member', 'loan'];
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
        debug && console.log('dest', dest);
        const reindexLoan = await Functions().asyncReindex({actions, source, dest, script, options});
        debug && console.log('reindexLoan', reindexLoan);

        /* Ticket */
        actions = ['icare_member', 'ticket'];
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
        debug && console.log('dest', dest);
        const reindexTicket = await Functions().asyncReindex({actions, source, dest, script, options});
        debug && console.log('reindexTicket', reindexTicket);

        /* Change index for bots alias */
        let
          removes = [],
          adds = [];
        const getAliasIndices = await Functions().getAliasIndices({alias});
        getAliasIndices && (removes = getAliasIndices.indices);
        adds = [indices.new.index];

        const updateAliases = await Functions().updateAliases({alias, removes, adds});

        /* Customer - number_iCMs (calculate the number of iCare members) */
        actions = ['customer', 'number_iCMs'];
        source = {
          // index: indices.new.index,
          index: indices.new.index,
          type: indices.new.types.icare_member
        };
        dest = {
          // index: indices.new.index,
          index: indices.new.index,
          type: indices.new.types.customer,
        };
        script = {};
        const field = 'number_iCMs';
        const etlNumberICMs = await Functions().etlField({actions, source, dest, field});
        debug && console.log('etlNumberICMs', etlNumberICMs)

        /* Consume result into message */
        const totalTime = Functions().getRunTime(runDate);
        message = formatMessage({message, heading1: 'Indices information', code: {indices}});
        message = formatMessage({message, heading1: 'Progress'});
        message = formatMessage({message, code: {totalTime}});
        message = formatMessage({message, bold: 'Customer', code: {reindexCustomer}});
        message = formatMessage({message, bold: 'iCare Member', code: {reindexICM}});
        message = formatMessage({message, bold: 'iCM Sales Order', code: {reindexSO}});
        message = formatMessage({message, bold: 'iCM Loan', code: {reindexLoan}});
        message = formatMessage({message, bold: 'iCM Ticket', code: {reindexTicket}});
        message = formatMessage({message, bold: 'Customer - number_iCMs', code: {etlNumberICMs}});
        message = formatMessage({message, bold: 'Get Bots Elastic Alias', code: {getAliasIndices}});
        message = formatMessage({message, bold: 'Update Bots Elastic Alias', code: {updateAliases}});
        
        return {message};
      } catch (e) {
        throw new Meteor.Error('REINDEX_CUSTOMER_INDEX', {detail: {actions, source, dest, script}, error: e});
      }
    }
  };
};

export default ETL

/* Test */
// const {Facebook} = require('/imports/api/facebook-graph');
// const {facebook: {adminWorkplace}} = Meteor.settings;
// ETL('kh').customer()
//   .then(res => {
//     // console.log('res', res);
//     /* Post result to Workplace */
//     const {message} = res;
//     Facebook().postMessage(adminWorkplace, message);
//   })
//   .catch(err => {
//     // console.log('err', err);
//     const message = formatMessage({heading1: 'REINDEX_CUSTOMER_TYPES', code: {error: err}});
//     Facebook().postMessage(adminWorkplace, message);
//   });
