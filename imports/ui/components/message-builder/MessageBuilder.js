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


class MessageBuilder extends Component {

  constructor(props) {
    super(props);

    const {
      variables = [{
        summaryType: '',
        field: '',
        name: '',
      }],
      template = '',
    } = props.message;

    this.state = {
      variables,
      template,
    };

    // handlers
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
  }

  handleCheck(e) {
    e.preventDefault();

    // console.log(this.state);
    const {variables} = this.state;
    const message = this.refs.template.getValue();
    const countLeft = (message.match(/{/g) || []).length;
    const countRight = (message.match(/}/g) || []).length;
    if (countLeft === countRight && countLeft > 0) {
      const values = {};
      let numOfValues = 0;
      let noVariable = false;
      variables.map((v) => {
        if (message.indexOf('{' + v.name + '}') >= 0) {
          values[v.name] = Math.floor(Math.random() * (1000 + 1) + 12);
          numOfValues++;
        }
        if (v.name === '')
          noVariable = true;
      });
      // console.log(values);
      if (noVariable) {
        Notify.warning({title: 'Message invalid', message: 'There are NO variable'});
      } else if (variables.length != numOfValues) {
        Notify.warning({title: 'Message invalid', message: 'Template DO NOT match with given variables'});
      } else {
        const sample = template(message, values);
        Notify.success({title: 'Message Sample:', message: ` "${sample}"`});
      }
    } else {
      Notify.warning({title: 'Message invalid', message: 'Template is INVALID '});
    }
  }

  _getDefaultVariable() {
    return {
      summaryType: '',
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
    const {variables} = this.state;
    variable = this._getDefaultVariable()
    ;
    variables.push(variable);

    return this.setState({
      variables,
    });
  }

  handleFieldChange(row, key, value) {
    const
      {variables} = this.state,
      variable = variables[row];
    let newVar = {...variable, [`${key}`]: value};
    const newVariables = variables.map((c, i) => {
      if (i === row) {
        return newVar;
      } else {
        return c;
      }
    });
    // console.log("newVariables", newVariables);
    return this.setState({
      variables: newVariables
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
    return this.state;
  }

  render() {
    const {variables, template} = this.state;
    let {handlers, readonly} = this.props;
    if (_.isEmpty(handlers)) {
      handlers = this.getDefaultHandlers();
    }
    return (
      <div className="col-md-12">
        <div className="row">
          <Label
            className="uppercase bold pull-left"
            value="Message Builder"
          />
          {readonly
            ? null
            : <Button
              className="btn-default pull-right"
              onClick={e => this._addRow(e)}
            ><span className="fa fa-plus"></span>{' Add'}</Button>
          }
        </div>
        <div className="row">
          <table className="table table-striped">
            <thead>
            <tr>
              <th>summaryType</th>
              <th>Field</th>
              <th>Variable</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody
            >
            {variables.map((variable, idx) => {
              // console.log("var",variable);
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
        <div className="row">
          <Label
            className="col-md-12 bold pull-left"
            value="Template"
          />
          <div className="col-md-8">
            {readonly ?
              <Label
                className="col-md-8 form-control pull-left"
                value={template}
              /> :
              <FormInput
                ref="template"
                multiline={true}
                type="text"
                value={template}
                className="form-control"
                placeholder="message template"
                handleOnChange={value => this._handleFieldChange('template', value)}
              />
            }
            <div className="">
              <Label className="small col-md-10 pull-left"
                     value="Ex: There are {icm} customers who has less than 110 iCare Members."/>
            </div>
          </div>
          {readonly ? null :
            < div className="col-md-2">
              <Button
                className="green"
                onClick={e => this.handleCheck(e)}
              >Preview</Button>
            </div>
          }
        </div>

      </div>
    )

  }
}

MessageBuilder.propTypes = {
  message: PropTypes.shape({
    summaryType: PropTypes.string,
    field: PropTypes.string,
    varName: PropTypes.string,
    template: PropTypes.string,
  }).isRequired,
};

export default MessageBuilder