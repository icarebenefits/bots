import {Migrations} from 'meteor/percolate:migrations';
import {MSLA} from '/imports/api/collections/monitor-sla';
import {Accounts} from 'meteor/accounts-base';

Migrations.add({
  version: 2,
  name: "Create Monitoring SLA - CPUUtilization",
  up() {
    const contacts = Accounts.users
      .find({"services.google.email": {$in: ['tan.ktm@icarebenefits.com', 'icare.bots@icarebenefits.com']}},
        {fields: {_id: true}})
      .fetch()
      .map(user => user._id);
    if(!_.isEmpty(contacts)) {
      const MonitorSLAs = require('./v2/CPUUtilization.json');
      if(!_.isEmpty(MonitorSLAs)) {
        MonitorSLAs.forEach(sla => {
          const
            {system, service, metric} = sla,
            name = `${system}-${service}-${metric}`;
          // console.log('insert SLA', {name, ...sla, contacts});
          MSLA.insert({name, ...sla, contacts});
        });
      }
    }
    MSLA.insert({
      name: 'MagentoWebCPU',
      system: 'magento',
      service: 'web',
      metric: 'cpu',
      conditions: [{value: 25, method: 'sms'}, {value: 24, method: 'email'}, {value: 20, method: 'note'}],
      noteGroup: 'magento',
      contacts: ['ZgLZLQcLHC9cs35wQ', 'fBY8rMkoxHPTyhYQN'],
      status: 'active'
    });
  }
});