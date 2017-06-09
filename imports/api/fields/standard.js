import Operator from './operator';

/**
 * Composition Standard fields
 * @constructor
 */
const Standard = () => ({
  Bool: () => ({
    props: () => ({
      id: 'bool',
      name: 'boolean',
    }),
    operator: () => ({
      bool: Object.assign({}, Operator().bool())
    })
  }),
  String: () => ({
    props: () => ({
      id: 'string',
      name: 'string',
    }),
    operator: () => ({
      is: Object.assign({}, Operator().is()),
      contains: Object.assign({}, Operator().contains()),
      startsWith: Object.assign({}, Operator().startsWith()),
      match: Object.assign({}, Operator().match()),
    })
  }),
  Number: () => ({
    props: () => ({
      id: 'number',
      name: 'number'
    }),
    operator: () => ({
      equal: Object.assign({}, Operator().equal()),
      lessThan: Object.assign({}, Operator().lessThan()),
      greaterThan: Object.assign({}, Operator().greaterThan()),
      lessThanOrEqual: Object.assign({}, Operator().lessThanOrEqual()),
      greaterThanOrEqual: Object.assign({}, Operator().greaterThanOrEqual()),
      between: Object.assign({}, Operator().between()),
    })
  }),
  Date: () => ({
    props: () => ({
      id: 'date',
      name: 'date',
    }),
    operator: () => ({
      on: Object.assign({}, Operator().on()),
      before: Object.assign({}, Operator().before()),
      after: Object.assign({}, Operator().after()),
      onOrBefore: Object.assign({}, Operator().onOrBefore()),
      onOrAfter: Object.assign({}, Operator().onOrAfter()),
      within: Object.assign({}, Operator().within()),
      inLast: Object.assign({}, Operator().inLast()),
    })
  }),
  Array: () => ({
    props: () => ({
      id: 'array',
      name: 'array',
    }),
    operator: () => ({
      in: Object.assign({}, Operator().inArray()),
    })
  }),
  Gender: () => ({
    props: () => ({
      id: 'gender',
      name: 'gender',
    }),
    operator: () => ({
      gender: Object.assign({}, Operator().gender()),
    })
  })
});

export default Standard