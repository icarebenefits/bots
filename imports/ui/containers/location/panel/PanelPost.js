import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';

/* Collections */
import {WorkplaceGroups} from '/imports/api/collections/workplaces';

// Components
import {Suggest, FormInput} from '/imports/ui/components/elements';
import {Spinner} from '/imports/ui/components/common';

class PanelPost extends Component {
  constructor() {
    super();

    this.state = {
      workplace: '',
      message: ''
    };
  }

  render() {
    const {visible, ready} = this.props;

    if (ready) {
      const {visible, onApply, Workplaces} = this.props;
      console.log('workplaces', Workplaces);
      return (
        <div className={classNames({"tab-pane ": true, "active": visible})}>
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <form className="margin-bottom-40" role="form">
                <div className="form-group form-md-line-input has-success margin-top-30">
                  <FormInput
                    ref="message"
                    className="form-control"
                    type="text"
                    multiline={true}
                    height={100}
                    value={this.state.message}
                    handleOnChange={value => this.setState({message: value})}
                  />
                  <label>Message: </label>
                </div>
                <Suggest
                  className="form-group form-md-line-input has-success margin-top-30"
                  ref="workplace"
                  options={Workplaces}
                  label="Workplace: "
                  handleOnChange={value => this.setState({workplace: value})}
                />
                <button
                  type="button"
                  className="btn green margin-top-30"
                  onClick={e => {
                    e.preventDefault();
                    onApply('post', {
                      workplace: this.state.workplace,
                      message: this.state.message
                    });
                  }}
                >Post
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={classNames({"tab-pane ": true, "active": visible})}>
          <Spinner/>
        </div>
      );
    }
  }
}
;

PanelPost.propTypes = {
  visible: PropTypes.bool,
  onApply: PropTypes.func
};

export default createContainer(() => {
  const sub = Meteor.subscribe('groups'),
    ready = sub.ready(),
    Workplaces = WorkplaceGroups.find({}, {fields: {id: true, name: true}}).fetch();

  return {
    ready,
    Workplaces: !_.isEmpty(Workplaces) ?
      _.uniqWith(Workplaces.map(w => ({name: w.id.toString(), label: w.name})), _.isEqual) :
      []
  };
}, PanelPost)