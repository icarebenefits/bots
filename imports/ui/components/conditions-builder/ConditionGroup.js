import React, {Component, PropTypes} from 'react';
// import classNames from 'classnames';

// components
import Condition from './Condition';
import {ValueSelector, ActionElement} from './controls';

class ConditionGroup extends Component {

  hasParentGroup() {
    return this.props.parentId;
  }

  onCombinatorChange = (value) => {
    const {onPropChange} = this.props.schema;

    onPropChange('combinator', value, this.props.id);
  }

  addRule = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const {createRule, onRuleAdd} = this.props.schema;

    const newRule = createRule();
    onRuleAdd(newRule, this.props.id)
  }

  addGroup = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const {createRuleGroup, onGroupAdd} = this.props.schema;
    const newGroup = createRuleGroup();
    onGroupAdd(newGroup, this.props.id)
  }

  removeGroup = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onGroupRemove(this.props.id, this.props.parentId);
  }

  render() {
    const
      {
        combinator, rules,
        schema: {combinators, controls, onRuleRemove, isRuleGroup, classNames}
      } = this.props,
      style = {
        marginRight: 5
      }
      ;

    // console.log({combinator, rules, schema: this.props.schema});

    return (
      <div className={`ruleGroup ${classNames.ruleGroup}`}>
        <div className="form-inline">
          <div className="form-group" style={style}>
            <ValueSelector
              label="Combinator"
              options={combinators}
              value={combinator}
              className={`ruleGroup-combinators ${classNames.combinators}`}
              handleOnChange={this.onCombinatorChange}
            />
          </div>
          <div className="form-group" style={style}>
            <ActionElement
              icon="glyphicon glyphicon-plus"
              label="Condition"
              className={`ruleGroup-addRule ${classNames.addRule}`}
              handleOnClick={this.addRule}
            />
          </div>
          <div className="form-group" style={style}>
            <ActionElement
              icon="glyphicon glyphicon-plus"
              label="Group"
              className={`ruleGroup-addGroup ${classNames.addGroup}`}
              handleOnClick={this.addGroup}
            />
          </div>
          {
            this.hasParentGroup()
              ? (<div className="form-group" style={style}>
              <ActionElement
                icon="glyphicon glyphicon-remove"
                label=""
                className={`ruleGroup-remove ${classNames.removeGroup}`}
                handleOnClick={this.removeGroup}
              />
            </div>)
              : null
          }
        </div>
        {
          rules.map(r => {
            return (
              isRuleGroup(r)
                ? <ConditionGroup key={r.id}
                                  id={r.id}
                                  schema={this.props.schema}
                                  parentId={this.props.id}
                                  combinator={r.combinator}
                                  rules={r.rules}/>
                : <Condition key={r.id}
                             id={r.id}
                             field={r.field}
                             value={r.value}
                             operator={r.operator}
                             schema={this.props.schema}
                             parentId={this.props.id}
                             onRuleRemove={onRuleRemove}/>

            );
          })
        }
          </div>
          );
          }
        }

        ConditionGroup.defaultProps = {
        id: null,
        parentId: null,
        rules: [],
        combinator: 'and',
        schema: {},
      };

        export default ConditionGroup