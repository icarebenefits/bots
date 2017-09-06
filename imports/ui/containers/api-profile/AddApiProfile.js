import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/* Collections */
import {Methods as ApiProfileMethods} from '/imports/api/collections/api-profile';

/* Components */
import {Suggest, FormInput, Button} from '/imports/ui/components/elements';
/* Notify */
import * as Notify from '/imports/api/notifications';

class AddApiProfile extends Component {
  constructor() {
    super();

    this.state = {
      profiles: []
    };

    ApiProfileMethods.getProfile.call((err, res) => {
      if(err) {
        return Notify.error({title: 'GET_PROFILES', message: err.reason});
      }
      const {profiles} = res;
      this.setState({profiles});
    });

    this._onAdd = this._onAdd.bind(this);
    this._getApiProfile = this._getApiProfile.bind(this);
  }

  _getApiProfile() {
    const {name, profile, endpoint} = this.refs;

    return {
      name: name.getValue(),
      profile: profile.getValue(),
      endpoint: endpoint.getValue()
    };
  }

  _onAdd() {
    const {name, profile, endpoint} = this._getApiProfile();

    console.log('create API Profile', {name, profile, endpoint});
    ApiProfileMethods.create.call({name, profile, endpoint}, (err) => {
      if(err) {
        return Notify.error({title: 'CREATE_API', message: err.reason});
      }
      Notify.info({title: 'CREATE_API', message: 'Success'});
    });

    return Notify.info({title: 'ADD_API_PROFIILE', message: 'gonna add API Profile'})
  }

  render() {
    const {profiles} = this.state;
    return (
      <div className="col-md-12">
        {/* information */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-toolbar">
              <div className="col-md-3">
                <FormInput
                  ref="name"
                  type="text"
                  value={''}
                  className="form-control input-medium"
                  placeholder="API name"
                  handleOnChange={() => {}}
                />
              </div>
              <div className="col-md-3">
                <FormInput
                  ref="endpoint"
                  type="text"
                  value={''}
                  className="form-control input-medium"
                  placeholder="API endpoint"
                  handleOnChange={() => {}}
                />
              </div>
              <div className="col-md-3 pull-left" style={{marginTop: 2, paddingRight: 0}}>
                <Suggest
                  ref="profile"
                  options={profiles}
                  defaultValue={''}
                  placeHolder="API profile"
                  handleOnChange={value => console.log('profile', value)}
                />
              </div>
              <div className="col-md-3 pull-left">
                <div className="btn-group">
                  <Button
                    id="add"
                    className="bold green"
                    disabled={false}
                    onClick={this._onAdd}
                  >Add{' '}<i className="fa fa-plus"/></Button>
                  {/*<Button*/}
                    {/*id="test"*/}
                    {/*className="bold green"*/}
                    {/*disabled={false}*/}
                    {/*onClick={this._onAdd}*/}
                  {/*>Test{' '}<i className="fa fa-angellist"/></Button>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddApiProfile.propTypes = {};

export default AddApiProfile
