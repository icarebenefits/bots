import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

// components
import {FormInput} from '/imports/ui/components/elements';

class PanelTimeRange extends Component {
  constructor() {
    super();

    this.state = {
      active: 'quick'
    };
  }

  _onClick(type, value) {
    switch (type) {
      case 'mode': {
        this.setState({
          active: value
        });
        break;
      }
    }
  }

  render() {
    const
      {active} = this.state,
      {visible} = this.props,
      typeButtons = [
        {name: 'quick', label: 'Quick'},
        {name: 'relative', label: 'Relative'},
        {name: 'absolute', label: 'Absolute'}
      ],
      quickMode = [
        [
          {name: 'today', label: 'Today'},
          {name: 'thisWeek', label: 'This week'},
          {name: 'thisMonth', label: 'This month'},
          {name: 'thisYear', label: 'This year'},
          {name: 'weekToDate', label: 'Week to date'},
          {name: 'monthToDate', label: 'Month to date'},
          {name: 'yearToDate', label: 'Year to date'},
        ],
        [
          {name: 'yesterday', label: 'Yesterday'},
          {name: 'dayBeforeYesterday', label: 'Day before yesterday'},
          {name: 'thisDayLastWeek', label: 'This day last week'},
          {name: 'previousWeek', label: 'Previous week'},
          {name: 'previousMonth', label: 'Previous month'},
          {name: 'previousYear', label: 'Previous year'}
        ],
        [
          {name: 'last15Minutes', label: 'Last 15 minutes'},
          {name: 'last30Minutes', label: 'Last 30 minutes'},
          {name: 'last1Hour', label: 'Last 1 hour'},
          {name: 'last4Hours', label: 'Last 4 hours'},
          {name: 'last12Hours', label: 'Last 12 hours'},
          {name: 'last24Hours', label: 'Last 24 hours'},
          {name: 'last7Days', label: 'Last 7 days'},
        ],
        [
          {name: 'last30Days', label: 'Last 30 days'},
          {name: 'last60Days', label: 'Last 60 days'},
          {name: 'last90Days', label: 'Last 90 days'},
          {name: 'last6Months', label: 'Last 6 months'},
          {name: 'last1Year', label: 'Last 1 year'},
          {name: 'last2Years', label: 'Last 2 years'},
          {name: 'last5Years', label: 'Last 5 years'},
        ]
      ];

    return (
      <div className={classNames({"tab-pane ": true, "active": visible})}>
        <div className="row">
          <div className="col-md-2 col-xs-12 margin-bottom-40">
            {typeButtons.map(b => (
              <button
                key={b.name}
                className={classNames({
                  "btn green-sharp btn-outline  btn-block sbold": true,
                  "active": active === b.name
                })}
                onClick={e => {
                  e.preventDefault();
                  this._onClick('mode', b.name)
                }}
              >{b.label}</button>
            ))}
          </div>
          {active === 'quick' && (
            <div className="col-md-10 col-xs-12">
              <div className="row about-links-cont" data-auto-height="true">
                <div className="about-links">
                  <div className="row">
                    {quickMode.map((quicks, idx) => (
                      <div key={idx} className="col-md-3 col-xs-12 about-links-item">
                        <ul>
                          {quicks.map(q => (
                            <li key={q.name}>
                              <a>{q.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {active === 'relative' && (
            <div className="col-md-10 col-xs-12">
              <form className="form-inline margin-bottom-40" role="form">
                <FormInput
                  type="date"
                  className="form-group form-md-line-input has-success margin-top-30"
                  label="From: "
                  labelClass=""
                />
                <div className="form-group form-md-line-input has-success margin-top-30">
                  <FormInput
                    type="select"
                    className="form-control"
                    options={[
                      {name: 'second', label: 'Seconds ago'},
                      {name: 'minute', label: 'Minutes ago'},
                      {name: 'hour', label: 'Hours ago'},
                      {name: 'day', label: 'Days ago'},
                      {name: 'week', label: 'Weeks ago'},
                      {name: 'month', label: 'Months ago'},
                      {name: 'year', label: 'Years ago'},
                    ]}
                  />
                </div>
                <div className="form-group form-md-line-input has-success margin-top-30">
                  <div className="input-group">
                    <input type="text" className="form-control" value="Now" disabled={true}/>
                      <label>To: Now</label>
                  </div>
                </div>
                <button type="button" className="btn green margin-top-30">Go!</button>
              </form>
            </div>
          )}
          {active === 'absolute' && (
            <div className="col-md-10 col-xs-12">
              <form className="form-inline margin-bottom-40" role="form">
                <FormInput
                  type="date"
                  className="form-group form-md-line-input has-success margin-top-30"
                  label="From: "
                  labelClass=""
                />
                <FormInput
                  type="date"
                  className="form-group form-md-line-input has-success margin-top-30"
                  label="To: "
                  labelClass=""
                />
                <button type="button" className="btn green margin-top-30">Go!</button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}
;

PanelTimeRange.propTypes = {
  visible: PropTypes.bool
};

export default PanelTimeRange