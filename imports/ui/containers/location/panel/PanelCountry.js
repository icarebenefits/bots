import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

// constants
import {COUNTRY_CONST} from '../CONSTANTS';

class PanelCountry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      country: props.country || 'vn'
    };
  }

  _onClick(name, label) {
    this.setState({
      country: name
    }, this.props.onApply('country', {country: name, countryLabel: label}));
  }

  render() {
    const
      {country} = this.state,
      {visible} = this.props,
      countryButtons = COUNTRY_CONST.buttons;

    return (
      <div className={classNames({"tab-pane": true, "active": visible})}>
        <div className="row">
          <div className="col-md-2 col-xs-12">
            {countryButtons.map(b => (
              <button
                key={b.name}
                className={classNames({
                  "btn green-sharp btn-outline  btn-block sbold": true,
                  "active": country === b.name
                })}
                onClick={e => {
                  e.preventDefault();
                  this._onClick(b.name, b.label)
                }}
              >{b.label}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

PanelCountry.propTypes = {
  visible: PropTypes.bool,
  onApply: PropTypes.func
};

export default PanelCountry