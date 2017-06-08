import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import _ from 'lodash';

/* Components */
import {FormInput, Label, Button, Checkbox} from '../elements';
import Bucket from './Bucket';
import Summary from './Summary';
/* Fields */
import {Field} from '/imports/api/fields';
/* Notify */
import * as Notify from '/imports/api/notifications';

class MessageBuilder extends Component {
  constructor(props) {
    super(props);

    const {
      variables = [this._getDefaultVariable()],
      messageTemplate = '',
      useBucket = false,
      bucket
    } = props.message;
    let
      bucketType = '',
      bucketGroup = '',
      bucketField = '',
      bucketHasOption = false,
      bucketOptions = {};

    if (!_.isEmpty(bucket)) {
      bucketType = bucket.type || '';
      bucketGroup = bucket.group || '';
      bucketField = bucket.field || '';
      bucketHasOption = bucket.hasOption || false;
      bucketOptions = bucket.options || {};
    }

    this.state = {
      useBucket,
      bucketType,
      bucketGroup,
      bucketField,
      bucketHasOption,
      bucketOptions,
      variables,
      messageTemplate,
    };


    this.getData = this.getData.bind(this);
    this._onCheckUseBucket = this._onCheckUseBucket.bind(this);
    // handlers
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.handleBucketChange = this.handleBucketChange.bind(this);

  }

  getData() {
    const {variables, messageTemplate, useBucket, bucketType, bucketGroup, bucketField, bucketHasOption, bucketOptions} = this.state;
    return {
      useBucket,
      bucket: {
        type: bucketType,
        group: bucketGroup,
        field: bucketField,
        hasOption: bucketHasOption,
        options: bucketOptions
      },
      variables, messageTemplate
    };
  }

  handleRemoveRow(row) {
    const {variables} = this.state;
    variables.splice(row, 1);
    return this.setState({
      variables,
    });
  }

  handleFieldChange(row, key, value) {
    const
      {variables} = this.state,
      variable = variables[row]
      ;
    let newVar = {};

    if (key === 'field') {
      const {groupId, value: val} = value;
      if (val.split('-').indexOf('total') !== -1) {
        newVar = {...variable, [`${key}`]: 'total', group: groupId};
        this.setState({disableAdd: true});
      } else {
        newVar = {...variable, [`${key}`]: val, group: groupId};
        this.setState({disableAdd: false});
      }
    } else {
      newVar = {...variable, [`${key}`]: value};
    }

    // console.log('row, key, value, newVar', row, key, value, newVar);

    const newVariables = variables.map((c, i) => {
      if (i === row) {
        return newVar;
      } else {
        return c;
      }
    });

    return this.setState({
      variables: newVariables,
      dialog: {
        row,
        fieldId: value
      }
    });
  }

  handleBucketChange(key, value) {
    switch (key) {
      case 'field':
      {
        const {groupId: group, value: field} = value,
          isDateField = Field()[group]().field()[field]().props().type === 'date';

        let hasOption = false;
        // hasOption
        (group !== 'empty') && (hasOption = isDateField || false);
        // type (currently, only support 2 type of bucket: date_histogram and terms)
        const type = isDateField ? 'date_histogram' : 'terms';

        console.log('group', group);
        return this.setState({
          bucketType: type,
          bucketGroup: group,
          bucketField: field,
          bucketHasOption: hasOption
        });
      }
      case 'interval':
        return this.setState({
          bucketOptions: {interval: value}
        });
      case 'orderBy':
        return this.setState({
          bucketOptions: {...this.state.bucketOptions, orderBy: value}
        });
      case 'orderIn':
        return this.setState({
          bucketOptions: {...this.state.bucketOptions, orderIn: value}
        });
      default:
        return Notify.error({title:'Bucket', message: `Unknown bucket option: ${key}`});
    }
  }

  _getDefaultVariable() {
    return {
      summaryType: '',
      group: '',
      field: '',
      name: '',
    }
  }

  _addRow(e) {
    e.preventDefault();
    const {variables} = this.state,
      variable = this._getDefaultVariable();
    variables.push(variable);

    return this.setState({
      variables,
    });
  }

  _onEnterTemplate(field, value) {
    this.setState({
      [field]: value
    });
  }

  _onCheckUseBucket(useBucket) {
    this.setState({useBucket});
  }

  _getDefaultHandlers() {
    return {
      handleFieldChange: this.handleFieldChange,
      handleRemoveRow: this.handleRemoveRow,
    };
  }

  render() {
    const {
      variables, messageTemplate,
      useBucket, bucketGroup, bucketField, bucketHasOption, bucketOptions
    } = this.state;
    let {handlers} = this.props;
    if (_.isEmpty(handlers)) {
      handlers = this._getDefaultHandlers();
    }

    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <div className="note note-info">
              <h4 className="block uppercase">Message Builder</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-body">
              <div className="form-group form-inline">
                <div className="mt-checkbox-list" style={{paddingBottom: 0}}>
                  <label className="mt-checkbox mt-checkbox-outline uppercase" style={{marginBottom: 0}}>
                    {' use Bucket'}
                    <Checkbox
                      className="form-control"
                      value={useBucket}
                      handleOnChange={this._onCheckUseBucket}
                    />
                    <span></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {useBucket && (
          <div className="row">
            <div className="col-md-12">
              <Label
                className="col-md-4 bold uppercase pull-left"
                value="Bucket:"
              />
            </div>
          </div>
        )}
        {useBucket && (
          <div className="row">
            <div className={bucketHasOption ? "col-md-12" : "col-md-8" }>
              <Bucket
                group={bucketGroup}
                field={bucketField}
                hasOption={bucketHasOption}
                options={bucketOptions}
                orderBy={bucketOptions.orderBy}
                orderIn={bucketOptions.orderIn}
                onChange={this.handleBucketChange}
              />
            </div>
          </div>
        )}
        <div className="hr-line-dashed"></div>
        <div className="row">
          <div className="col-md-12">
            <Label
              className="col-md-4 bold uppercase pull-left"
              value="Summary:"
            />
            <Button
              className="btn-default pull-right"
              onClick={e => this._addRow(e)}
            ><span className="fa fa-plus"></span>{' Add'}</Button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Summary
              ref="summary"
              useBucket={useBucket}
              bucketGroup={bucketGroup}
              variables={variables}
              handlers={handlers}
            />
          </div>
        </div>
        <div className="hr-line-dashed"></div>
        <div className="row">
          <div className="col-md-12">
            <Label
              className="col-md-4 bold uppercase pull-left"
              value="Template:"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <FormInput
              ref="template"
              multiline={true}
              type="text"
              value={messageTemplate}
              className="form-control"
              placeholder="There are {icm} customers who has less than 110 iCare Members."
              handleOnChange={value => this._onEnterTemplate('messageTemplate', value)}
            />
          </div>
        </div>
      </div>
    )
  }
}

MessageBuilder.propTypes = {
  message: PropTypes.shape({
    messageTemplate: PropTypes.string,
  }).isRequired,
};

export default MessageBuilder