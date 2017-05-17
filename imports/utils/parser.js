import {check} from 'meteor/check';
import _ from 'lodash';
/**
 * Parse a schedule object to later.js schedule text
 * @param {Object} schedule
 * @return {String} later.js schedule text
 */
const parseScheduleText = (schedule) => {
  check(schedule, Object);
  const
    {preps, range, unit, preps2, range2} = schedule;
  let text = '';

  !_.isEmpty(preps) && (text = `${preps}`);
  !_.isEmpty(range) && (text = `${text} ${range}`);
  !_.isEmpty(unit) && (preps === 'at') ? (text = `${text}:${unit}`) : (text = `${text} ${unit}`);
  !_.isEmpty(preps2) && (text = `${text} ${preps2}`);
  !_.isEmpty(range2) && (text = `${text} ${range2}`);

  return text.trim();
};

const Parser = () => ({
  scheduleText: parseScheduleText
});

export default Parser