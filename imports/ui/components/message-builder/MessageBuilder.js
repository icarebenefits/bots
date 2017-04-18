/**
 * Created by vinhcq on 3/15/17.
 */
import React, {Component, PropTypes} from 'react';

import {
  FormInput,
  Label,
  Button,
} from '../elements';
import {Variable} from './Variable';
import * as Notify from '/imports/api/notifications';
import template from "string-template";
import _ from 'lodash';


class MessageBuilder extends Component {

  constructor(props) {
    super(props);

    const {
      variables = [{
        summaryType: '',
        group: '',
        field: '',
        name: '',
      }],
      messageTemplate = '',
    } = props.message;

    this.state = {
      variables,
      messageTemplate,
      dialog: {}, // get field had been change, {row, groupId, fieldId}
    };

    // handlers
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);

  }

  handleCheck(e) {
    e.preventDefault();

    // console.log(this.state);
    const {variables, messageTemplate} = this.state;
    const countLeft = (messageTemplate.match(/{/g) || []).length;
    const countRight = (messageTemplate.match(/}/g) || []).length;
    if (countLeft === countRight && countLeft > 0) {
      const values = {};
      let numOfValues = 0;
      let hasInvalidVariable = false;
      let isUnused = false;
      let isDuplicated = false;
      variables.map((v) => {
        const {summaryType, field, name} =v;
        if (messageTemplate.indexOf('{' + name + '}') >= 0) {
          if (values[name] === undefined) {
            values[name] = Math.floor(Math.random() * (1000 + 1) + 12);
            numOfValues++;
          }
          else {
            Notify.warning({title: 'Message invalid:', message: `Variable "${name}" is duplicated.`});
            isDuplicated = true;
          }
        }
        else {
          Notify.warning({title: 'Message invalid:', message: `Variable "${name}" is not used.`});
          isUnused = true;
        }
        if (_.isEmpty(summaryType) || _.isEmpty(field) || _.isEmpty(name))
          hasInvalidVariable = true;
      });
      // console.log(values);
      if (isUnused || isDuplicated) {
        return;
      } else if (hasInvalidVariable) {
        Notify.warning({title: 'Message invalid', message: 'There are INVALID variable'});
      } else if (variables.length != numOfValues || numOfValues != countLeft) {
        Notify.warning({title: 'Message invalid', message: 'Template DO NOT match with given variables'});
      } else {
        const sample = template(messageTemplate, values);
        Notify.success({title: 'Message Sample:', message: ` "${sample}"`});
      }
    } else {
      Notify.warning({title: 'Message invalid', message: 'Template is INVALID '});
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

  handleRemoveRow(row) {
    const {variables} = this.state;
    variables.splice(row, 1);
    return this.setState({
      variables,
    });
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

  _handleFieldChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  getDefaultHandlers() {
    return {
      handleFieldChange: this.handleFieldChange,
      handleRemoveRow: this.handleRemoveRow,
    };
  }

  getData() {
    const {variables, messageTemplate,} = this.state;
    return {variables, messageTemplate,};
  }

  render() {
    const {variables, messageTemplate} = this.state;
    let {handlers, readonly} = this.props;
    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }

    return (
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <Label
              className="col-md-4 bold uppercase pull-left"
              value="Message: "
            />
            {(readonly)
              ? null
              : <Button
                className="btn-default pull-right"
                onClick={e => this._addRow(e)}
              ><span className="fa fa-plus"></span>{' Add'}</Button>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
              <tr>
                <th>Type</th>
                <th>Field</th>
                <th>Variable</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody
              >
              {variables.map((variable, idx) => {
                return (
                  <Variable
                    key={idx}
                    id={idx}
                    ref={`var-${idx}`}
                    variable={variable}
                    readonly={readonly}
                    handlers={handlers}
                  />
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Label
              className="col-md-4 bold pull-left"
              value="Template"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {readonly ?
              <Label
                className="col-md-8 form-control pull-left"
                value={messageTemplate}
              /> :
              <FormInput
                ref="messageTemplate"
                multiline={true}
                type="text"
                value={messageTemplate}
                className="form-control"
                placeholder="message messageTemplate"
                handleOnChange={value => this._handleFieldChange('messageTemplate', value)}
              />
            }
            <div className="">
              <Label className="small col-md-10 pull-left"
                     value="Ex: There are {icm} customers who has less than 110 iCare Members."/>
            </div>
          </div>
          {/*readonly ? null :
            < div className="col-md-2">
              <Button
                className="green"
                onClick={e => this.handleCheck(e)}
              >Preview</Button>
            </div>
          */}
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