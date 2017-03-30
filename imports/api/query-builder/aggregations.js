import bodybuilder from 'bodybuilder';
import {check} from 'meteor/check';
import {FieldsGroups} from '/imports/api/fields';

/**
 * Function build the elastic aggregations query
 * the name of aggregation has default format: agg_<type>_<field> .
 * @param aggs
 * @return {*}
 */
const aggsBuilder = (aggs) => {
  check(aggs, Array);

  let aggsQuery = bodybuilder();

  aggs.map(agg => {
    const {summaryType, group, field} = agg;

    /* validate aggs params */
    // summaryType
    if (['value_count', 'sum', 'avg', 'max', 'min'].indexOf(summaryType) === -1) {
      return {error: `${summaryType} unsupported.`};
    }
    let ESField = '';

    if (field === 'total') {
      ESField = 'id';
    } else {
      ESField = FieldsGroups[group].fields[field]().props.ESField;
    }
    aggsQuery = aggsQuery.aggregation(summaryType, ESField);
  });

  return aggsQuery.build();
};

export default aggsBuilder