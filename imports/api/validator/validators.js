import validate from 'validate.js';
import {later} from 'meteor/mrt:later';
import _ from 'lodash';
import S from 'string';

/* Functions */
import {makeExpression, validateConditions} from '/imports/api/query-builder';
/* Utils */
import {Parser, getVarsFromString} from '/imports/utils';

const Validators = validate.validators;

/**
 * Validate SLA schedule with later.js schedule text
 * @param schedule
 * @return {*}
 */
Validators.schedule = (schedule) => {
  const scheduleText = Parser().scheduleText(schedule);

  // schedule can't be blank
  if (_.isEmpty(scheduleText)) {
    return "is required.";
  }

  // verify with later.js
  const {error} = later.parse.text(scheduleText);
  // error = -1: success; > 0 failed
  if (error > 0) {
    return `"${scheduleText}" is invalid.`
  }
  // return;
};

/**
 * Validate SLA conditions
 * @param conditions
 */
Validators.slaConditions = (conditions) => {
  if(!_.isEmpty(conditions)) {
    if(conditions.length === 1) {
      const {openParens, group, filter, operator, values, closeParens, bitwise} = conditions[0];
      if((_.isEmpty(openParens) && _.isEmpty(filter) && _.isEmpty(group) && _.isEmpty(operator)
        && _.isEmpty(values) && _.isEmpty(closeParens) && _.isEmpty(bitwise))) {
        return;
      }
    }

    let mess = '';
    conditions.forEach((c, i) => {
      const {group, filter, operator, values} = c;
      if (_.isEmpty(filter)) {
        mess = `filter is required in row ${i + 1}.`;
        return;
      }
      if (_.isEmpty(group)) {
        mess = `filter is unsupported in row ${i + 1}.`;
        return;
      }
      if (_.isEmpty(operator)) {
        mess = `operator is required in row ${i + 1}.`;
        return;
      }
      if (_.isEmpty(values)) {
        mess = `values is required in row ${i + 1}.`;
        return;
      }
    });
    if (!_.isEmpty(mess)) {
      return mess;
    }

    const {error} = validateConditions(conditions, makeExpression(conditions));
    if(error) {
      return `: ${error}`;
    }
  }
};

/**
 * Validate SLA message
 * @param message
 */
Validators.slaMessage = (message) => {
  const {variables, messageTemplate} = message;

  // variables can't be empty
  if (_.isEmpty(variables)) {
    return 'is required.'
  } else {
    let mess = '';
    variables.forEach((v, i) => {
      const {summaryType, group, field, name} = v;
      if (_.isEmpty(summaryType)) {
        mess = `type is required in row ${i + 1}.`;
        return;
      }
      if (_.isEmpty(field)) {
        mess = `field is required in row ${i + 1}.`;
        return;
      }
      if (_.isEmpty(group)) {
        mess = `field is unsupported in row ${i + 1}.`;
        return;
      }
      if (_.isEmpty(name)) {
        mess = `variable is required in row ${i + 1}.`;
        return;
      }
    });
    if (!_.isEmpty(mess)) {
      return mess;
    }
  }
  // messageTemplate can't be empty
  if (_.isEmpty(messageTemplate)) {
    return 'template is required.'
  }

  // number of template open & close
  const
    numOpen = S(messageTemplate).count('{'),
    numClose = S(messageTemplate).count('}');
  if (numOpen === 0 || numClose === 0) {
    return `variables is unused in template.`;
  }
  if (numOpen < numClose) {
    return `template is wrong syntax - missing open curly brace "{".`;
  }
  if (numClose < numOpen) {
    return `template is wrong syntax - missing close curly brace "}".`;
  }

  // message name can't be duplicated
  const names = variables.map(v => v.name);
  const uniqNames = _.uniq(names);
  if (names.length != uniqNames.length) {
    return `variable is duplicated.`;
  }

  // make sure name is used in template
  let unUnusedName = '';
  names.map(n => {
    if (!S(messageTemplate).contains(`{${n}}`)) {
      unUnusedName = n;
      return;
    }
  });
  if (!_.isEmpty(unUnusedName)) {
    return `variable is "${unUnusedName}" - unused.`;
  }

  // find invalid variables in messageTemplate
  // get all variables from messageTemplate
  const templateVars = getVarsFromString(messageTemplate.trim(), []);
  const invalidVars = _.difference(templateVars, uniqNames) || [];
  if (!_.isEmpty(invalidVars)) {
    return `template has invalid variable${invalidVars.length > 1 ? 's' : ''}: 
    "${invalidVars.join(', ')}".`;
  }
};