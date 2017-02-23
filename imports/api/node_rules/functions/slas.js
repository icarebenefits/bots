import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import createRule from './rules';
import RuleEngine from 'node-rules';

const createSLA = (ruleConditions) => {
  check(ruleConditions, Array);

  const rules = [];
  ruleConditions.map(ruleCondition => {
    // const {name, priority, condition, operator, threshold} = ruleCondition;
    const rule = createRule(ruleCondition);

    if(!rule) {
      throw new Meteor.Error('CAN_NOT_CREATE_RULE', 'can not create rule with function createRule!!');
    }

    rules.push(createRule(ruleCondition));
  });

  return new RuleEngine(rules);
};

export default createSLA