import _ from 'lodash';
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
      const search = {};
      if(!_.isEmpty(name)) {
        search.name = name;
      }
      if(!_.isEmpty(workplace)) {
        const wp = WPCollection.findOne({id: Number(workplace)}, {fields: {name: true}});
        search.workplace = wp.name;
      }
      if(!_.isEmpty(frequency)) {
        search.frequency = frequency;
      }
      if(!_.isEmpty(lastExecutedAt)) {
        search.lastExecutedAt = lastExecutedAt;
      }

      const searchText =  getSearchText(search);

      SLACollection.update({_id}, {$set: {searchText}});
    });
  }
});