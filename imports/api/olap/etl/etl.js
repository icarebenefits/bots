import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import moment from 'moment';
/* RFM */
import {
  indexRFMModel, indexAllRFMScores, indexSegmentForAllOfiCM,
  getRFMScoreBoard, getRFMTopTen
} from '/imports/api/rfm';
/* Functions */
import {Functions} from '../';
import {formatMessage, Parser} from '/imports/utils';

/* Scripts */
import Scripts from './scripts';

const ETL = (country) => {
  check(country, String);

  return {
    customer: async() => {
      try {
        const
          runDate = new Date(), // running time
          {
            elastic: {
              reindex: {debug},
              indices: {
                base: baseIndex,
                etl: etlIndex,
                bots: botsIndex,
                rfm: rfmIndex
              }
            },
            public: {env}
          } = Meteor.settings,
          {suffix} = Parser().indexSuffix(runDate, 'minutes'), // elastic index suffix
          alias = `${botsIndex.prefix}_${country}_${env}`,
          indices = {
            base: {
              index: `${baseIndex.prefix}_${env}_${country}`,
              types: baseIndex.types
            },
            etl: {
              index: `${etlIndex.prefix}_${alias}`,
              types: etlIndex.types
            },
            new: {
              index: `${alias}-${suffix}`,
              types: botsIndex.types
            },
            rfm: {
              index: `${rfmIndex.prefix}_${country}_${env}`,
              types: rfmIndex.types
            }
          },
          {
            lang, bots: {
            customer: customersScripts,
            icareMember: iCMsScripts,
            salesOrder: SOScripts,
            loan: loanScripts,
            ticket: ticketScripts,
            kyc: kycScripts
          }
          } = Scripts();
        let
          source = {},
          dest = {},
          script = {},
          field = '',
          options = {refresh: true, waitForCompletion: true, requestTimeout: 120000},
          message = formatMessage({

            heading1: `ETL - Index: ${alias} - on ${moment(runDate).format('LLL')}`
          });

        /* Reindex Customer */
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
        const reindexCustomer = await Functions().asyncReindex({source, dest, script, options});
        debug && console.log('reindexCustomer', reindexCustomer);

        /* iCare member */
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
        const reindexICM = await Functions().asyncReindex({source, dest, script, options});
        debug && console.log('reindexICM', reindexICM);

        /* Parallel reindex icare_member child and additional fields */
        /* Sales Order */
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
              ],
              must_not: [
                {
                  "term": {
                    "so_number": {
                      "value": "kyc"
                    }
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
        const reindexSO = await Functions().asyncReindex({source, dest, script, options});
        debug && console.log('reindexSO', reindexSO);

        /* Loan */
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
        const reindexLoan = await Functions().asyncReindex({source, dest, script, options});
        debug && console.log('reindexLoan', reindexLoan);

        /* iCM - Ticket */
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
        const reindexTicket = await Functions().asyncReindex({source, dest, script, options});
        debug && console.log('reindexTicket', reindexTicket);

        /* iCM - KYC */
        source = {
          index: indices.etl.index,
          type: indices.etl.types.icm_kyc,
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
          type: indices.new.types.kyc,
        };
        script = {
          lang,
          inline: Object.keys(kycScripts)
            .map(s => kycScripts[s])
            .join(';')
        };
        debug && console.log('dest', dest);
        const reindexKYC = await Functions().asyncReindex({source, dest, script, options});
        debug && console.log('reindexKYC', reindexKYC);

        /* Change index for bots alias */
        let
          removes = [],
          adds = [];
        const getAliasIndices = await Functions().getAliasIndices({alias});
        getAliasIndices && (removes = getAliasIndices.indices);
        adds = [indices.new.index];

        const updateAliases = await Functions().updateAliases({alias, removes, adds});
        // const updateAliases = {};

        /* Customer - number_iCMs (calculate the number of iCare members) */
        source = {
          // index: 'bots_vn_stage-2017.06.07-10.28',
          index: indices.new.index,
          type: indices.new.types.icare_member
        };
        dest = {
          // index: 'bots_vn_stage-2017.06.07-10.28',
          index: indices.new.index,
          type: indices.new.types.customer
        };
        script = {};
        field = 'number_iCMs';
        const etlNumberICMs = await Functions().etlField({source, dest, field});
        debug && console.log('etlNumberICMs', etlNumberICMs);

        /* iCare member - is_activated (icare member had activated the iCM app or not) */
        source = {
          // index: indices.new.index,
          index: indices.etl.index,
          type: indices.etl.types.icare_member
        };
        dest = {
          // index: 'bots_vn_stage-2017.06.07-10.28',
          index: indices.new.index,
          type: indices.new.types.icare_member
        };
        script = {};
        field = 'icm_app_activated';
        const etlICMAppActivated = await Functions().etlField({source, dest, field, options: {mode: 1, _source: true}});
        debug && console.log('etlICMAppActivated', etlICMAppActivated);

        /* iCare member - rfm (RFM segmentation of iCM) */
        source = {
          // index: indices.new.index,
          index: indices.rfm.index,
          type: indices.rfm.types.year
        };
        dest = {
          // index: 'bots_vn_stage-2017.06.07-10.28',
          index: indices.new.index,
          type: indices.new.types.icare_member
        };
        script = {};
        field = 'rfm';
        const etlRFM = await Functions().etlField({
          source, dest, field,
          options: {
            mode: 1,
            _source: ["segment", "recency", "frequency", "monetary", "recency_score", "frequency_score", "monetary_score"]
          }
        });
        debug && console.log('etlRFM', etlRFM);

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
        message = formatMessage({message, bold: 'iCM KYC', code: {reindexKYC}});
        message = formatMessage({message, bold: 'Customer - number_iCMs', code: {etlNumberICMs}});
        message = formatMessage({message, bold: 'iCM - icm_app_activated', code: {etlICMAppActivated}});
        message = formatMessage({message, bold: 'iCM - rfm', code: {etlRFM}});
        message = formatMessage({message, bold: 'Get Bots Elastic Alias', code: {getAliasIndices}});
        message = formatMessage({message, bold: 'Update Bots Elastic Alias', code: {updateAliases}});

        return {message};
      } catch (err) {
        throw new Meteor.Error('REINDEX_CUSTOMER_INDEX', err.message);
      }
    },
    rfm: async() => {
      try {
        const
          runDate = new Date(),
          rfmType = 'year',
          {suffix} = Parser().indexSuffix(runDate, 'minute'),
          {
            elastic: {indices: {bots: botsIndex, rfm: rfmIndex}, reindex: {secondSleep}},
            public: {env},
          } = Meteor.settings,
          period = rfmIndex.periods[rfmType],
          source = {
            index: `${botsIndex.prefix}_${country}_${env}`,
            type: botsIndex.types.sales_order
          },
          dest = {
            index: `${rfmIndex.prefix}_${country}_${env}-${suffix}`,
            type: rfmIndex.types[rfmType]
          },
          index = dest.index,
          type = dest.type,
          alias = `${rfmIndex.prefix}_${country}_${env}`;
        let
          message = formatMessage({
            heading1: `ETL - Index: RFM FOR ${country} - on ${moment(runDate).format('LLL')}`
          }),
          removes = [], // list aliases need to be removed
          adds = []; // list aliases need to be added

        /* Index RFM Model */
        const indexRFMModelResult = await indexRFMModel({source, dest, period, country, runDate});
        Meteor._sleepForMs(secondSleep * 1000);
        /* Index RFM Scores */
        const indexAllRFMScoresResult = await indexAllRFMScores({index, type, country});
        Meteor._sleepForMs(secondSleep * 1000);
        const indexSegmentForAllOfiCMResult = await indexSegmentForAllOfiCM({index, type, country});
        Meteor._sleepForMs(secondSleep * 1000);
        const getRFMScoreBoardResult = await getRFMScoreBoard({index, type, period, country});
        Meteor._sleepForMs(secondSleep * 1000);
        const getRFMTopTenResult = await getRFMTopTen({index, type, country});
        Meteor._sleepForMs(secondSleep * 1000);

        /* Change index for rfm alias */
        const getAliasIndices = await Functions().getAliasIndices({alias});
        getAliasIndices && (removes = getAliasIndices.indices);
        adds = [index];
        const updateAliases = await Functions().updateAliases({alias, removes, adds});

        message = formatMessage({message, heading1: 'Progress'});
        message = formatMessage({message, bold: 'RFM Model', code: {indexRFMModelResult}});
        message = formatMessage({message, bold: 'RFM Scores', code: {indexAllRFMScoresResult}});
        message = formatMessage({message, bold: 'iCM Segments', code: {indexSegmentForAllOfiCMResult}});
        message = formatMessage({message, bold: 'RFM Scoreboard', code: {getRFMScoreBoardResult}});
        message = formatMessage({message, bold: 'RFM TopTen', code: {getRFMTopTenResult}});
        message = formatMessage({message, bold: 'RFM update Alias', code: {updateAliases}});

        return {message};
      } catch (err) {
        throw new Meteor.Error('REINDEX_RFM_INDEX', err.message);
      }
    }
  };
};

export default ETL

/* Test */
// ETL Customer
// const {Facebook} = require('/imports/api/facebook-graph');
// const {facebook: {adminWorkplace}} = Meteor.settings;
// const country = 'la';
// console.log(`Reindexing bots data for ${country}`);
// ETL(country).customer()
//   .then(res => {
//     // console.log('res', res);
//     /* Post result to Workplace */
//     const {message} = res;
//     Facebook().postMessage(adminWorkplace, message);
//   })
//   .catch(err => {
//     console.log('err', err);
//     const message = formatMessage({heading1: 'REINDEX_CUSTOMER_INDEX', code: {error: err.message}});
//     Facebook().postMessage(adminWorkplace, message);
//   });

// ETL RFM
// const {Facebook} = require('/imports/api/facebook-graph');
// const {facebook: {adminWorkplace}} = Meteor.settings;
// const country = 'la';
// console.log(`Reindexing RFM data for ${country}`);
// ETL(country).rfm()
//   .then(res => {
//     // console.log('res', res);
//     /* Post result to Workplace */
//     const {message} = res;
//     Facebook().postMessage(adminWorkplace, message);
//   })
//   .catch(err => {
//     console.log('err', err);
//     const message = formatMessage({heading1: 'REINDEX_RFM_INDEX', code: {error: err.message}});
//     Facebook().postMessage(adminWorkplace, message);
//   });
