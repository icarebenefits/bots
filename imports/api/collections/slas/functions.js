import {Promise} from 'meteor/promise';
import {DDP} from 'meteor/ddp-client';

/* Collections */
import SLAs from './slas';
import {Countries} from '/imports/api/collections/countries';

export const publishSLA = (_id, country) => {
  return new Promise((resolve, reject) => {
    // get SLA info
    const sla = SLAs.findOne({_id});
    if (!_.isEmpty(sla)) {
      try {
        // connect to production with DDP protocol
        const {host} = Meteor.settings.public.prod;
        const BotsProd = DDP.connect(`http://${host}`);

        const
          {
            name: originalName, description,
            frequency, conditions, message
          } = sla;
        const
          name = `${country} - ${originalName}_published`,
          workplace = '',
          status = 'draft';

        // validate name for published SLA
        BotsProd.call('sla.validateName', {name, country}, (err, res) => {
          if (err) {
            reject(new Meteor.Error('VALIDATE_NAME_IN_PROD', err.reason));
          } else {
            const {validated, detail} = res;
            if (!validated) {
              reject(new Meteor.Error('VALIDATE_NAME_IN_PROD', detail[0]));
            } else {
              // publish SLA to production
              BotsProd.call('sla.create', {
                name, description, workplace,
                frequency, conditions, message,
                status, country
              }, (err, res) => {
                if (err)
                  throw new Meteor.Error('CREATE_SLA_IN_PROD', err.reason);

                const {_id} = res;
                // return the published SLA URL
                const publishedUrl = `http://${host}/app/setup/${country}?tab=sla&mode=edit&id=${_id}`;

                // disconnect from production
                BotsProd.disconnect();

                resolve({publishedUrl});
              });
            }
          }
        });
      } catch (err) {
        reject(new Meteor.Error('SLA.publish', err.message));
      }
    } else {
      reject(new Meteor.Error('SLA.publish', 'SLA not found.'));
    }
  });
};