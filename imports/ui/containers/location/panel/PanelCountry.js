import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

class PanelCountry extends Component {
  constructor() {
    super();

    this.state = {
      active: 'vn'
    };
  }

  _onClick(type, value) {
    switch (type) {
      case 'country': {
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
        {name: 'vn', label: 'Vietnam'},
        {name: 'kh', label: 'Cambodia'},
        {name: 'la', label: 'Laos'}
      ];
    console.log('active', active);
    return (
      <div className={classNames({"tab-pane": true, "active": visible})}>
        <div className="row">
          <div className="col-md-2 col-xs-12">
            {typeButtons.map(b => (
              <button
                key={b.name}
                className={classNames({
                  "btn green-sharp btn-outline  btn-block sbold": true,
                  "active": active === b.name
                })}
                onClick={e => {
                  e.preventDefault();
                  this._onClick('country', b.name)
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
  visible: PropTypes.bool
};

export default PanelCountry