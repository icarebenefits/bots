import Standard from './standard';
/**
 * Composition Standard fields which got operators from standard fields
 * @constructor
 * group: tickets
 */

const iCMLoan = () => ({
  props: () => ({
    id: 'iCMLoan',
    name: 'iCare member loan',
    type: 'group'
  }),
  elastic: () => ({
    id: 'id',
    type: 'loan',
    grandParent: 'customer',
    parent: 'icare_members',
  }),
  field: () => ({
    loanSaving: () => Object.assign(
      {},
      Standard().Number(),
      {
        props: () => ({
          id: 'loanSaving',
          name: 'Saving',
          type: 'number'
        }),
        elastic: () => ({
          field: 'saving',
        })
      }
    ),
  })
});

export default iCMLoan