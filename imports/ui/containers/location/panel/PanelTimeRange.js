import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dateMath from '@elastic/datemath';
import moment from 'moment';

// components
import {FormInput} from '/imports/ui/components/elements';
// constants
import {TIME_RANGE_CONST} from '../CONSTANTS';

class PanelTimeRange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: props.timeRange.mode || 'quick',
      timeRange: props.timeRange || {from: 'now/d', to: 'now/d', label: 'Today', mode: 'quick'}
    };

    /* Handlers */
    // private
    this._onClick = this._onClick.bind(this);
  }

  _onClick(type, value) {
    switch (type) {
      case 'mode': {
        this.setState({
          mode: value
        });
        break;
      }
      case 'timeRange': {
        this.setState({
          timeRange: value
        }, this.props.onApply('timeRange', {
          timeRange: {
            from: value.from,
            to: value.to,
            mode: value.mode
          },
          timeRangeLabel: value.label
        }));
        break;
      }
    }
  }

  render() {
    const
      {mode} = this.state,
      {visible} = this.props,
      quickButtons = TIME_RANGE_CONST.quick.buttons,
      quickRanges = TIME_RANGE_CONST.quick.ranges,
      relativeOptions = TIME_RANGE_CONST.relative.options;

    return (
      <div className={classNames({"tab-pane ": true, "active": visible && mode !== ''})}>
        <div className="row">
          <div className="col-md-2 col-xs-12 margin-bottom-40">
            {quickButtons.map(b => (
              <button
                key={b.name}
                className={classNames({
                  "btn green-sharp btn-outline  btn-block sbold": true,
                  "active": mode === b.name
                })}
                onClick={e => {
                  e.preventDefault();
                  this._onClick('mode', b.name)
                }}
              >{b.label}</button>
            ))}
          </div>
          {mode === 'quick' && (
            <div className="col-md-10 col-xs-12">
              <div className="row about-links-cont" data-auto-height="true">
                <div className="about-links">
                  <div className="row">
                    {quickRanges.map((quicks, idx) => (
                      <div key={idx} className="col-md-3 col-xs-12 about-links-item">
                        <ul>
                          {quicks.map((q, idx) => (
                            <li key={idx} className="list-unstyled">
                              <a
                                onClick={e => {
                                  e.preventDefault();
                                  this._onClick('timeRange', {from: q.from, to: q.to, label: q.label, mode})
                                }}
                              >{q.label}</a>
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
          {mode === 'relative' && (
            <div className="col-md-10 col-xs-12">
              <form className="form-inline margin-bottom-40" role="form">
                <div className="form-group form-md-line-input has-success margin-top-30">
                  <div className="input-group">
                    <input
                      type="number"
                      ref="relativeDuration"
                      className="form-control"
                      defaultValue="1"
                    />
                    <label>From: </label>
                  </div>
                </div>
                <div className="form-group form-md-line-input has-success margin-top-30">
                  <FormInput
                    type="select"
                    ref="relativeUnit"
                    className="form-control"
                    options={relativeOptions}
                    defaultValue="d"
                  />
                </div>
                <div className="form-group form-md-line-input has-success margin-top-30">
                  <div className="input-group">
                    <input type="text" className="form-control" value="Now" disabled={true}/>
                    <label>To: Now</label>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn green margin-top-30"
                  onClick={e => {
                    e.preventDefault();
                    const duration = this.refs.relativeDuration.value;
                    const unit = this.refs.relativeUnit.getValue();
                    this._onClick('timeRange', {
                      from: `now-${duration}${unit}`,
                      to: 'now',
                      label: `${duration} ${relativeOptions.filter(r => r.name === unit)[0].label}`,
                      mode
                    });
                  }}
                >Go!
                </button>
              </form>
            </div>
          )}
          {mode === 'absolute' && (
            <div className="col-md-10 col-xs-12">
              <form className="form-inline margin-bottom-40" role="form">
                <FormInput
                  type="date"
                  ref="absoluteFrom"
                  className="form-group form-md-line-input has-success margin-top-30"
                  label="From: "
                  labelClass=""
                  value={new Date(moment().subtract(1, 'day'))}
                />
                <FormInput
                  type="date"
                  ref="absoluteTo"
                  className="form-group form-md-line-input has-success margin-top-30"
                  label="To: "
                  labelClass=""
                  value={new Date()}
                />
                <button
                  type="button"
                  className="btn green margin-top-30"
                  onClick={e => {
                    e.preventDefault();
                    let
                      from = moment(this.refs.absoluteFrom.getValue()).format('YYYY-MM-DD HH:mm:ss'),
                      to = moment(this.refs.absoluteTo.getValue()).format('YYYY-MM-DD HH:mm:ss');

                    if (from === 'Invalid date')
                      from = moment(new Date(moment().subtract(1, 'day'))).format('YYYY-MM-DD HH:mm:ss');
                    if (to === 'Invalid date')
                      to = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

                    this._onClick('timeRange', {
                      from, to,
                      label: `From: ${from}, To: ${to}`,
                      mode
                    });
                  }}
                >Go!
                </button>
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
  visible: PropTypes.bool,
  onApply: PropTypes.func
};

PanelTimeRange.defaultProps = {
  visible: false,
  onApply: () => {
  }
};

export default PanelTimeRange