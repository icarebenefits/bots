import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {connect} from 'react-redux';
import S from 'string';
import moment from 'moment';

/* CONSTANTS */
import {
  TOOLBARS, LISTS,
  SLA_SET_FILTER, SLA_SET_SEARCH, SLA_CHANGE_MODE
} from '/imports/ui/store/constants';
import {setFilter, setSearch, slaChangeMode} from '/imports/ui/store/actions';

/* Collections */
import {WorkplaceGroups as WPCollection} from '/imports/api/collections/workplaces';
import SLACollection from '/imports/api/collections/slas/slas';

/* Components */
import {List, Toolbar} from '/imports/ui/components';

/* Functions */
import {searchSLAList, getScheduleText} from '/imports/utils';

class ListSLA extends Component {
  constructor(props) {
    super(props);

    this._getListData = this._getListData.bind(this);
  }

  _getListData() {
    const {SLAs, WPs, search} = this.props;
    let list = SLAs;
    if(!_.isEmpty(search)) {
      list = searchSLAList(list, WPs, search);
    }

    return list.map(s => {
      let wpName = '';
      if(s.workplace) {
        const wp = WPs.filter(w => w.id === Number(s.workplace));
        if(!_.isEmpty(wp)) {
          wpName = wp[0].name;
        } else {
          wpName = '';
        }
      }
      return {
        _id: s._id, row: [
          {id: 'name', type: 'input', value: s.name},
          {
            id: 'workplace',
            type: 'input',
            value: wpName
          },
          {
            id: 'frequency',
            type: 'input',
            value: (s.frequency.preps === 'at' && _.isEmpty(s.frequency.preps2))
              ? `${getScheduleText(s.frequency)} daily`
              : getScheduleText(s.frequency)
          },
          {
            id: 'lastExecution',
            type: 'input',
            value: s.lastExecutedAt
              ? moment(new Date(s.lastExecutedAt)).format('LLL')
              : (s.status === 'draft' ? 'pending' : 'waiting')
          },
          {id: 'status', type: 'input', value: s.status},
        ]
      }
    });
  }

  render() {
    const {ready, filter, dispatch} = this.props;
    if(ready) {
      return (
        <div className="col-md-12">
          <Toolbar
            {...TOOLBARS['listSLA']}
            toolLabel={`${S(filter).capitalize().s} SLA`}
            onFilter={f => dispatch(setFilter(SLA_SET_FILTER)(f))}
            onSearch={s => dispatch(setSearch(SLA_SET_SEARCH)(s))}
            onClick={m => dispatch(slaChangeMode(m))}
          />

          {/*<ListHeader />*/}
          <List
            {...LISTS['listSLA']}
            data={this._getListData()}

          />

          {/*<ListFooter />*/}
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

ListSLA.propTypes = {};

const ListSLAContainer = createContainer((props) => {
  const
    {country, filter, search} = props,
    slaStatus = filter === 'all' ? undefined : filter,
    subWp = Meteor.subscribe('groups'),
    subSLAs = Meteor.subscribe('slasList'),
    ready = subWp.ready() && subSLAs.ready(),
    WPs = WPCollection.find({country}).fetch();

  const selector = {country};
  // filter by status
  if(slaStatus) {
    selector.status = slaStatus;
  }
  const SLAs = SLACollection.find(selector).fetch();

  return {
    ready,
    country,
    filter,
    search,
    WPs,
    SLAs,
  };
}, ListSLA);


const mapStateToProps = state => {
  const {
    pageControl: {country},
    sla: {
      filter,
      search
    }
  } = state;
  return {
    country,
    filter,
    search
  };
};

export default connect(mapStateToProps)(ListSLAContainer)
