import {Migrations} from 'meteor/percolate:migrations';
import {SLAs as SLACollection, getSearchText} from '/imports/api/collections/slas';
import {WorkplaceGroups as WPCollection} from '/imports/api/collections/workplaces';

Migrations.add({
  version: 1,
  name: "Create SLA searchText field",
  up() {
    const SLAs = SLACollection.find().fetch();
    // update field searchText for SLA
    SLAs.map(SLA => {
      const {_id, name, workplace, frequency, lastExecutedAt} = SLA;
      const wp = WPCollection.findOne({id: Number(workplace)}, {fields: {name: true}});
      const searchText =  getSearchText({name, workplace: wp.name, frequency, lastExecutedAt});

      SLACollection.update({_id}, {$set: {searchText}});
    });
  }
});