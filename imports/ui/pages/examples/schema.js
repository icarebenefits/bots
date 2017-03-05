import classification from './classification';
import {FlowRouter} from 'meteor/kadira:flow-router';

export const NavigationTabsSchema = [
  {
    id: 'home',
    href: '#',
    title: FlowRouter.path('home')
  },
  {
    id: 'preferences',
    href: FlowRouter.path('preferences'),
    title: 'Preferences',
  }
];

export const BreadcrumbsSchema = [
  {
    id: ''
  }
];

export const schema = {
  defaultCondition: [
    { // cell: not
      id: 'not',
      label: 'Not',
      type: 'checkbox',
      value: false,
    },
    { // cell: openParens
      id: 'openParens',
      label: 'Parens',
      type: 'select',
      options: classification.conditionsBuilder.openParens,
      value: classification.conditionsBuilder.openParens[0],
    },
    { // cell: filter
      id: 'filter',
      label: 'Filter',
      type: 'select',
      options: classification.conditionsBuilder.filters,
      value: classification.conditionsBuilder.filters[0],
    },
    { // cell: 
      id: 'description',
      label: 'Description',
      type: 'label',
      operator: "",
      value: "",
    },
    { // cell: closeParens
      id: 'closeParens',
      label: 'Parens',
      type: 'select',
      options: classification.conditionsBuilder.closeParens,
      value: classification.conditionsBuilder.closeParens[0],
    },
    { // cell: bitwise
      id: 'bitwise',
      label: 'And/Or',
      type: 'select',
      options: classification.conditionsBuilder.bitwise,
      value: classification.conditionsBuilder.bitwise[0],
    },
  ],
  conditions: [
    [
      { // cell: not
        id: 'not',
        label: 'Not',
        type: 'checkbox',
        value: false,
      },
      { // cell: openParens
        id: 'openParens',
        label: 'Parens',
        type: 'select',
        options: classification.conditionsBuilder.openParens,
        value: classification.conditionsBuilder.openParens[0],
      },
      { // cell: filter
        id: 'filter',
        label: 'Filter',
        type: 'select',
        options: classification.conditionsBuilder.filters,
        value: classification.conditionsBuilder.filters[0],
      },
      { // cell: 
        id: 'description',
        label: 'Description',
        type: 'label',
        operator: "",
        value: "",
      },
      { // cell: closeParens
        id: 'closeParens',
        label: 'Parens',
        type: 'select',
        options: classification.conditionsBuilder.closeParens,
        value: classification.conditionsBuilder.closeParens[0],
      },
      { // cell: bitwise
        id: 'bitwise',
        label: 'And/Or',
        type: 'select',
        options: classification.conditionsBuilder.bitwise,
        value: classification.conditionsBuilder.bitwise[2],
      },
    ],
    // [
    //   { // cell: not
    //     id: 'not',
    //     label: 'Not',
    //     type: 'checkbox',
    //     value: true,
    //   },
    //   { // cell: openParens
    //     id: 'openParens',
    //     label: 'Parens',
    //     type: 'select',
    //     options: classification.conditionsBuilder.openParens,
    //     value: classification.conditionsBuilder.openParens[1],
    //   },
    //   { // cell: filter
    //     id: 'filter',
    //     label: 'Filter',
    //     type: 'select',
    //     options: classification.conditionsBuilder.filters,
    //     value: classification.conditionsBuilder.filters[3],
    //   },
    //   { // cell:
    //     id: 'description',
    //     label: 'Description',
    //     type: 'input',
    //     operator: "is",
    //     value: "Developer",
    //   },
    //   { // cell: closeParens
    //     id: 'closeParens',
    //     label: 'Parens',
    //     type: 'select',
    //     options: classification.conditionsBuilder.closeParens,
    //     value: classification.conditionsBuilder.closeParens[0],
    //   },
    //   { // cell: bitwise
    //     id: 'bitwise',
    //     label: 'And/Or',
    //     type: 'select',
    //     options: classification.conditionsBuilder.bitwise,
    //     value: classification.conditionsBuilder.bitwise[0],
    //   },
    // ]
  ]
};

export default [
  {
    id: 'name',
    label: 'Name',
    show: true, // show in the Excel Table
    sample: '$2 chuck',
    align: 'left', // align in Excel
  },
  {
    id: 'grape',
    label: 'Grape',
    type: 'suggest',
    options: classification.grapes,
    show: true, // show in the Excel Table
    sample: 'Merlot',
    align: 'left', // align in Excel
  },
  {
    id: 'comments',
    label: 'Comments',
    type: 'text',
    show: true, // show in the Excel Table
    sample: 'Nice for the price'
  },
]
