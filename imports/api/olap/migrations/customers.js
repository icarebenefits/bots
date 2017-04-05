import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import bodybuilder from 'bodybuilder';
import accounting from 'accounting';

import {Logger} from '/imports/api/logger';
import {Elastic} from '../../elastic';
import scripts from './scripts';
const {batches} = Meteor.settings.elastic.migration;

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
 * Function sync customers basic information
 * @param source
 * @param dest
 * @param script
 * @param options
 * @return {*}
 */
const syncCustomersBasicInfo = ({source, dest, script, options}) => {
  const action = 'syncCustomersBasicInfo';
  try {
    // docs: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-reindex
    const result = Elastic.reindex({
      ...options,
      body: {
        source,
        dest,
        script
      }
    });

    /* Success */
    return {result: {name: action, message: JSON.stringify(result)}};

  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 * Function sync business units basic information
 * @param source
 * @param dest
 * @param script
 * @param options
 */
const syncBusinessUnitsBasicInfo = ({source, dest, script, options}) => {
  const action = 'syncBusinessUnitsBasicInfo';
  try {
    // docs: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-reindex
    const body = {source, dest};
    !_.isEmpty(script) && (body.script = script);
    const result = Elastic.reindex({
      ...options,
      body
    });

    /* Success */
    return {result: {name: action, message: JSON.stringify(result)}};

  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 * Function sync business units into customers
 * @param source
 * @param dest
 * @return {*}
 */
const syncBusinessUnitsIntoCustomers = ({source, dest}) => {
  const action = 'syncBusinessUnitsBasicInfoIntoCustomers';
  /* get all _id of customers */
  const
    {index, type} = dest,
    body = {
      query: {
        match_all: {}
      }
    };

  try {
    // get total customers
    const {hits: {total}} = Elastic.search({
      index,
      type,
      body,
      size: 0,
    });

    if (total > 0) {
      /* get business units for all customers */
      for (let i = 0; i < total; i += batches) {
        body.from = i;
        body.size = batches;

        try {
          const {hits: {total, hits: customers}} = Elastic.search({
            index,
            type,
            _source: false,
            body,
          });

          customers.map(cus => {
            const {_id} = cus;
            const
              {index, type} = source,
              body = bodybuilder()
                .query('term', 'netsuite_customer_id', _id)
                .build()
              ;
            try {
              body.size = 0;
              const {hits: {total}} = Elastic.search({
                index,
                type,
                body,
              });
              if (total > 0) {
                for (let i = 0; i < total; i += batches) {
                  body.from = i;
                  body.size = batches;

                  const {hits: {hits}} = Elastic.search({
                    index,
                    type,
                    body,
                  });

                  const BUs = hits.map(({_source}) => {
                    /* remove unused fields */
                    const unusedFields = ['country', 'type', '@timestamp', '@version',];
                    const fields = removeUnusedFields({data: _source, unusedFields});
                    return fields;
                  });

                  try {
                    const {index, type} = dest;
                    const addBUs = Elastic.update({
                      index,
                      type,
                      id: _id,
                      body: {
                        doc: {
                          business_units: BUs
                        }
                      }
                    });

                    Logger.info({name: action, message: JSON.stringify(addBUs)});

                  } catch (e) {
                    /* Failed */
                    Logger.warn({name: action, message: JSON.stringify(e)});
                  }
                }
              } else {
                Logger.warn({
                  name: action,
                  message: JSON.stringify({index, type, body})
                });
              }
            } catch (e) {
              Logger.warn({name: action, message: JSON.stringify(e)});
            }
          });
        } catch (e) {
          /* Failed */
          Logger.warn({name: action, message: JSON.stringify(e)});
        }
      }

      // Finish sync
      return {result: {name: action, message: JSON.stringify({total})}};

    } else {
      return {result: {name: action, message: JSON.stringify({total})}};
    }
  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 * Function sync iCare Members basic information into icare_members
 * @param source
 * @param dest
 * @param script
 * @param options
 * @return {*}
 */
const syncIcareMembersBasicInfo = ({source, dest, script, options}) => {
  const action = 'syncIcareMembersBasicInfo';

  try {
    // docs: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-reindex
    const result = Elastic.reindex({
      ...options,
      body: {
        source,
        dest,
        script
      }
    });

    /* Success */
    return {result: {name: action, message: JSON.stringify(result)}};

  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 * Function sync iCare Members mifos information into icare_members
 * @param source
 * @param dest
 * @return {*}
 */
const syncIcareMembersMifosInfo = ({source, dest}) => {
  const action = 'syncIcareMembersMifosInfo';
  /* get all _id of magento_customer_id */
  const
    {index, type} = source,
    body = {
      query: {
        match_all: {}
      }
    };

  try {
    // get total mifos clients
    const {hits: {total, hits}} = Elastic.search({
      index,
      type,
      body,
      size: 0,
    });

    if (total > 0) {
      /* get mifos clients to import into icare_members */
      for (let i = 0; i < total; i += batches) {
        body.from = i;
        body.size = batches;

        try {
          const {hits: {total, hits: clients}} = Elastic.search({
            index,
            type,
            body,
          });

          clients.map(c => {
            const {_source: {clientExternalId, loans, dueInstallments, dpdInfo, totalSavingBalance}} = c;

            if (clientExternalId) {
              const {index, type} = dest;
              const doc = {};

              !_.isEmpty(loans) && (doc.loans = loans)
              !_.isEmpty(dpdInfo) && (doc.dpd = dpdInfo);
              !_.isEmpty(totalSavingBalance) && (doc.saving = totalSavingBalance);
              !_.isEmpty(dueInstallments) && (doc.due_installments = dueInstallments);

              const addMifosInfo = Elastic.update({
                index,
                type,
                id: clientExternalId,
                body: {doc}
              });

              Logger.info({name: action, message: {index, type, addMifosInfo}});

            } else {
              Logger.warn({name: action, message: {index, type, client: c}})
            }
          });
        } catch (e) {
          /* Failed */
          Logger.warn({name: action, message: JSON.stringify(e)});
        }
      }

      // Finish sync
      return {result: {}};

    } else {
      return {result: {name: action, message: JSON.stringify({total, hits})}};
    }
  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 * Function sync iCare Members into Business Units
 * @param source
 * @param dest
 * @return {*}
 */
const syncIcareMembersIntoBusinessUnits = ({source, dest}) => {
  const action = 'syncIcareMembersIntoBusinessUnits';

  /* get total business units */
  const
    {index, type} = dest,
    body = {
      query: {
        match_all: {}
      }
    };

  try {
    // get total business units
    const {hits: {total}} = Elastic.search({
      index,
      type,
      body,
      size: 0,
    });

    // console.log('total business units', total);

    if (total > 0) {
      /* get icare members for all business units */
      for (let i = 0; i < total; i += batches) {
        body.from = i;
        body.size = batches;

        try {
          const {hits: {hits: BUs}} = Elastic.search({
            index,
            type,
            _source: false,
            body,
          });

          // console.log('BUs', BUs);

          BUs.map(bu => {
            const {_id} = bu;
            const
              {index, type} = source,
              body = bodybuilder()
                .query('term', 'netsuite_business_unit_id', _id)
                .build()
              ;
            try {
              body.size = 0;
              const {hits: {total}} = Elastic.search({
                index,
                type,
                body,
              });
              // console.log('bu _id', _id, 'total icms', total)
              if (total > 0) {
                let iCMs = [];
                for (let i = 0; i < total; i += batches) {
                  body.from = i;
                  body.size = batches;

                  const {hits: {hits}} = Elastic.search({
                    index,
                    type,
                    body,
                  });

                  hits.map(({_source}) => {
                    iCMs.push(_source);
                  });
                }

                // console.log('update', {index, type, id: _id, body: {doc: {icare_members: JSON.stringify(iCMs), length: iCMs.length}}});
                console.log('BU', _id, 'iCMs', iCMs.length);
                try {
                  const {index, type} = dest;
                  const addiCMs = Elastic.update({
                    index,
                    type,
                    id: _id,
                    body: {
                      doc: {
                        icare_members: iCMs
                      }
                    }
                  });

                  Logger.info({name: action, message: JSON.stringify(addiCMs)});

                } catch (e) {
                  /* Failed */
                  Logger.warn({name: action, message: JSON.stringify(e), action: 'addiCMs'});
                }
              } else {
                Logger.warn({
                  name: action,
                  message: JSON.stringify({index, type, body, reason: 'no document found'})
                });
              }
            } catch (e) {
              Logger.warn({name: action, message: JSON.stringify(e)});
            }
          });
        } catch (e) {
          /* Failed */
          Logger.warn({name: action, message: JSON.stringify(e)});
        }
      }

      // Finish sync
      return {result: {name: action, message: JSON.stringify({total})}};

    } else {
      return {result: {name: action, message: JSON.stringify({total})}};
    }
  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 * Function test sync data
 * @param source
 * @param dest
 * @param script
 * @param options
 */
const testSync = ({source, dest, script, options}) => {
  const action = 'testSync';

  /* get total business units */
  const
    {index, type} = dest,
    body = {
      query: {
        match_all: {}
      }
    };

  try {
    const {hits: {total}} = Elastic.search({
      index,
      type,
      body,
      size: 0,
    });


    if (total > 0) {
      const _id = '3390';
      const {index, type} = source,
        body = bodybuilder()
          .query('term', 'netsuite_business_unit_id', _id)
          .build()
      ;

      const {hits: {total}} = Elastic.search({
        index,
        type,
        body,
      });

      console.log('total icare members of bu', _id, total);
    }
    // Finish sync
    return {result: {name: action, message: JSON.stringify({result})}};
  } catch (e) {
    /* Failed */
    return {error: {name: action, message: JSON.stringify(e)}};
  }
};

/**
 *
 * @param country
 * @return {{migrate: (function())}}
 */
const customers = ({country}) => {
  const
    runDate = new Date(), // running time
    {
      elastic: {indexPrefix: prefix}, // elastic index prefix
      public: {env} // running environment
    } = Meteor.settings,
    suffix = moment(runDate).format('YYYY.MM.DD-HH.mm'), // elastic index suffix
    newIndex = `${prefix}_${country}_${env}-${suffix}`,
    baseIndex = `icare_${env}_${country}`,
    tempIndex = `${prefix}_${country}_${env}_tmp`,
    alias = `${prefix}_${country}_${env}`
    ;

  return {
    migrate: () => {
      const
        source = {
          index: baseIndex,
          type: 'b2b_customer',
        },
        dest = {
          index: newIndex,
          type: 'customers',
        },
        {lang, bots: {customers: customersScripts}} = scripts,
        options = {refresh: true, waitForCompletion: true};
      const script = {
        lang,
        inline: Object.keys(customersScripts)
          .map(s => customersScripts[s])
          .join(';')
      };

      /* sync customers basic information */
      // console.log('syncCustomersBasicInfo', {source, dest, script, options});
      const {error, result} = syncCustomersBasicInfo({source, dest, script, options});
      if (error) {
        /* failed */
        Logger.error({
          name: 'MIGRATE_CUSTOMERS.syncCustomersBasicInfo',
          message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
        });
        return {
          error: {
            name: 'MIGRATE_CUSTOMERS.syncCustomersBasicInfo',
            message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
          }
        };
      } else {
        /* success */
        Logger.info({
          name: 'syncCustomersBasicInfo',
          message: {runTime: `${getRunTime(runDate)} seconds`, result: JSON.stringify(result)}
        });

        /* sync business units basic information */
        const
          source = {
            index: tempIndex,
            type: 'business_units',
          },
          dest = {
            index: newIndex,
            type: 'business_units',
          },
          script = {};
        const {error, result} = syncBusinessUnitsBasicInfo({source, dest, script, options});
        if (error) {
          /* failed */
          Logger.error({
            name: 'MIGRATE_CUSTOMERS.syncBusinessUnitsBasicInfo',
            message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
          });
          return {
            error: {
              name: 'MIGRATE_CUSTOMERS.syncBusinessUnitsBasicInfo',
              message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
            }
          };
        } else {
          /* success */
          Logger.info({
            name: 'syncBusinessUnitsBasicInfo',
            message: {runTime: `${getRunTime(runDate)} seconds`, result: JSON.stringify(result)}
          });

          /* sync icare members basic information */
          const
            source = {
              index: baseIndex,
              type: 'customer',
            },
            dest = {
              index: newIndex,
              type: 'icare_members',
            },
            {lang, bots: {icareMembers: iCMsScripts}} = scripts;
          const script = {
            lang,
            inline: Object.keys(iCMsScripts)
              .map(s => iCMsScripts[s])
              .join(';')
          };

          const {error, result} = syncIcareMembersBasicInfo({source, dest, script, options});
          if (error) {
            /* failed */
            Logger.error({
              name: 'MIGRATE_CUSTOMERS.syncIcareMembersBasicInfo',
              message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
            });
            return {
              error: {
                name: 'MIGRATE_CUSTOMERS.syncIcareMembersBasicInfo',
                message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
              }
            };
          } else {
            /* success */
            Logger.info({
              name: 'syncIcareMembersBasicInfo',
              message: {runTime: `${getRunTime(runDate)} seconds`, result: JSON.stringify(result)}
            });

            /* sync iCare Members loans, saving, dpd, due_installments */
            const
              source = {
                index: baseIndex,
                type: 'm_client',
              },
              dest = {
                index: newIndex,
                type: 'icare_members',
              };
            // const {error, result} = syncIcareMembersMifosInfo({source, dest});
            const error = null, result = {name: 'syncIcareMembersMifosInfo', message: 'skipped'};
            if (error) {
              /* failed */
              Logger.error({
                name: 'MIGRATE_CUSTOMERS.syncIcareMembersMifosInfo',
                message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
              });
              return {
                error: {
                  name: 'MIGRATE_CUSTOMERS.syncIcareMembersMifosInfo',
                  message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
                }
              };
            } else {
              /* success */
              Logger.info({
                name: 'syncIcareMembersMifosInfo',
                message: {runTime: `${getRunTime(runDate)} seconds`, result: JSON.stringify(result)}
              });

              /* sync icare members into business units */
              const
                source = {
                  index: newIndex,
                  type: 'icare_members',
                },
                dest = {
                  index: newIndex,
                  type: 'business_units',
                };
              const {error, result} = syncIcareMembersIntoBusinessUnits({source, dest});
              // const {error, result} = testSync({source, dest});
              if (error) {
                /* failed */
                Logger.error({
                  name: 'MIGRATE_CUSTOMERS.syncIcareMembersIntoBusinessUnits',
                  message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
                });
                return {
                  error: {
                    name: 'MIGRATE_CUSTOMERS.syncIcareMembersIntoBusinessUnits',
                    message: {runTime: `${getRunTime(runDate)} seconds`, error: JSON.stringify(error)}
                  }
                };
              } else {
                /* success */
                Logger.info({
                  name: 'syncIcareMembersIntoBusinessUnits',
                  message: {runTime: `${getRunTime(runDate)} seconds`, result: JSON.stringify(result)}
                });

                return {
                  result: {
                    name: 'MIGRATE_CUSTOMERS',
                    message: {runTime: `${getRunTime(runDate)} seconds`, result: JSON.stringify(result)}
                  }
                };
              }
            }
          }
        }


        /* sync business units basic information */
        // const
        //   source = {
        //     index: `${prefix}_${country}_${env}_tmp`,
        //     type: 'business_units',
        //   },
        //   dest = {
        //     index: `${prefix}_${country}_${env}-${suffix}`,
        //     type: 'customers',
        //   };
        // const {error, result} = syncBusinessUnitsBasicInfo({source, dest});
        // if (error) {
        //   return {error: {name: 'MIGRATE_CUSTOMERS', message: error}}
        // }
      }
    }
  }
};

export default customers