import _ from 'lodash';
import {Migrations} from 'meteor/percolate:migrations';
import {MSLA} from '/imports/api/collections/monitor-sla';
import {Accounts} from 'meteor/accounts-base';

Migrations.add({
  version: 2,
  name: "Create Monitoring SLA",
  up() {
    const SLA_DEFINITIONS = {
      EC2: {
        CPUUtilization: require('./v2/EC2/CPUUtilization.json'),
        MemoryUtilization: require('./v2/EC2/MemoryUtilization.json'),
        SwapUtilization: require('./v2/EC2/SwapUtilization.json'),
        DiskSpaceUtilization: require('./v2/EC2/DiskSpaceUtilization.json')
      },
      RDS: {
        CPUUtilization: require('./v2/RDS/CPUUtilization.json'),
        DatabaseConnections: require('./v2/RDS/DatabaseConnections.json'),
        FreeableMemory: require('./v2/RDS/FreeableMemory.json'),
        FreeStorageSpace: require('./v2/RDS/FreeStorageSpace.json'),
        SwapUsage: require('./v2/RDS/SwapUsage.json')
      },
      ES: {
        ClusterIndexWritesBlocked: require('./v2/ES/ClusterIndexWritesBlocked.json'),
        "ClusterStatus.red": require('./v2/ES/ClusterStatus.red.json'),
        CPUUtilization: require('./v2/ES/CPUUtilization.json'),
        JVMMemoryPressure: require('./v2/ES/JVMMemoryPressure.json'),
        FreeStorageSpace: require('./v2/ES/FreeStorageSpace.json'),
        AutomatedSnapshotFailure: require('./v2/ES/AutomatedSnapshotFailure.json')
      }
    };
    const
      contactDefaults = ['tan.ktm@icarebenefits.com', 'hai.tdd@mobivi.vn', 'chris@icarebenefits.com'],
      CONTACT_GROUPS = {
        test: ['icare.bots@icarebenefits.com'],
        system: [...contactDefaults],
        netsuite: [...contactDefaults, 'nam.ph@icarebenefits.com', 'duc.bv@icarebenefits.com'],
        mifos: [...contactDefaults, 'binh.pt@mobivi.vn'],
        magento: [...contactDefaults, 'bao.nq@icarebenefits.com'],
        b2b: [...contactDefaults, 'khoa.le@icarebenefits.com'],
        tls: [...contactDefaults, 'khoa.le@icarebenefits.com', 'hau.tc@mobivi.vn'],
        integration: [...contactDefaults]
      };

    Object.keys(SLA_DEFINITIONS).forEach(group => {
      console.log(`${group}: `, SLA_DEFINITIONS[group]);
      Object.keys(SLA_DEFINITIONS[group]).forEach(nameSpace => {
        SLA_DEFINITIONS[group][nameSpace].forEach(sla => {
          const {noteGroup} = sla;
          const contacts = Accounts.users
            .find({"services.google.email": {$in: CONTACT_GROUPS[noteGroup]}},
              {fields: {_id: true}})
            .fetch()
            .map(user => user._id);
          // console.log('insert SLA', {...sla, contacts});
          MSLA.insert({...sla, contacts});
        });
      });
    });
  }
});