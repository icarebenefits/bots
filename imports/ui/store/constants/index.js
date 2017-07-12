/* SLOGANS */
export const SLOGANS = {
  vn: 'Vietnam',
  kh: 'Cambodia',
  la: 'Laos'
};
/* TABS */
export const TABS = {
  setup: [
    {id: 'workplace', name: 'Workplace'},
    {id: 'sla', name: 'SLA'},
    {id: 'rfm', name: 'RFM'}
  ],
  default: []
};
/* SIDEBAR */
export const SIDEBAR = {
  sla: [
    {id: 'list', icon: 'fa fa-star', label: 'List SLA'},
    {id: 'add', icon: 'fa fa-plus', label: 'Add SLA'},
    // {id: 'edit', icon: 'fa fa-pencil', label: 'Edit SLA'},
    // {id: 'view', icon: 'fa fa-circle', label: 'View SLA'}
  ]
};
/* TOOLBAR */
export const TOOLBARS = {
  listSLA: {
    buttons: [
      {
        id: 'add',
        className: 'bold green',
        icon: 'fa fa-plus',
        label: 'Add'
      }
    ],
    tools: [
      {id: 'all', icon: '', label: 'All'},
      {id: 'active', icon: '', label: 'Active'},
      {id: 'inactive', icon: '', label: 'Inactive'},
      {id: 'draft', icon: '', label: 'Draft'}
    ],
    searchBox: {}
  }
};
/* AGGS OPTIONS */
export const AGGS_OPTIONS = [
  {name: 'value_count', label: 'count'},
  {name: 'sum', label: 'sum'},
  {name: 'max', label: 'max'},
  {name: 'min', label: 'min'},
  {name: 'avg', label: 'average'}
];
/* SCHEDULER OPTIONS */
export const SCHEDULER_OPTIONS = {
  firstPart: {
    prepsOpts: [
      {name: '', label: ''},
      {name: 'on the', label: 'on the'},
      {name: 'at', label: 'at'},
      {name: 'every', label: 'every'}
    ],
    rangeOpts: {
      'on the': [
        {name: '', label: ''},
        {name: 'first', label: 'first'},
        {name: 'last', label: 'last'}
      ],
      at: [
        {name: '', label: ''},
        {name: '1', label: '1'}, {name: '2', label: '2'}, {name: '3', label: '3'},
        {name: '4', label: '4'}, {name: '5', label: '5'}, {name: '6', label: '6'},
        {name: '7', label: '7'}, {name: '8', label: '8'}, {name: '9', label: '9'},
        {name: '10', label: '10'}, {name: '11', label: '11'}, {name: '12', label: '12'},
        {name: '13', label: '13'}, {name: '14', label: '14'}, {name: '15', label: '15'},
        {name: '16', label: '16'}, {name: '17', label: '17'}, {name: '18', label: '18'},
        {name: '19', label: '19'}, {name: '20', label: '20'}, {name: '21', label: '21'},
        {name: '22', label: '22'}, {name: '23', label: '23'}, {name: '24', label: '24'}
      ],
      every: [
        {name: '', label: ''},
        {name: '1', label: '1'}, {name: '2', label: '2'}, {name: '3', label: '3'},
        {name: '4', label: '4'}, {name: '6', label: '6'}, {name: '8', label: '8'},
        {name: '12', label: '12'}
      ]
    },
    unitOpts: {
      'on the': [
        {name: '', label: ''},
        {name: 'day of the week', label: 'day of the week'},
        {name: 'day of the month', label: 'day of the month'},
        {name: 'week of the month', label: 'week of the month'},
        {name: 'week of the year', label: 'week of the year'}
      ],
      at: [
        {name: '', label: ''},
        {name: '00', label: '00'}, {name: '10', label: '10'}, {name: '20', label: '20'},
        {name: '30', label: '30'}, {name: '40', label: '40'}, {name: '50', label: '50'}
      ],
      every: [
        {name: '', label: ''}, {name: 'days', label: 'days'},
        {name: 'weeks', label: 'weeks'}, {name: 'months', label: 'months'}
      ]
    }
  },
  secondPart: {
    prepsOpts: [
      {name: '', label: 'daily'},
      {name: 'on', label: 'on'},
      {name: 'every', label: 'on every'}
    ],
    rangeOpts: {
      on: [
        {name: '', label: ''},
        {name: 'monday', label: 'monday'},
        {name: 'tuesday', label: 'tuesday'},
        {name: 'wednesday', label: 'wednesday'},
        {name: 'thursday', label: 'thursday'},
        {name: 'friday', label: 'friday'},
        {name: 'saturday', label: 'saturday'},
        {name: 'sunday', label: 'sunday'}
      ],
      every: [
        {name: '', label: ''},
        {name: 'weekday', label: 'weekday'},
        {name: 'weekend', label: 'weekend'}
      ]
    }
  }
};

/* ACTION TYPES */

/* Page Control */
export const SET_COUNTRY = 'PAGE::SET_COUNTRY';
export const SET_SLOGAN = 'PAGE::SET_SLOGAN';
export const SET_TABS = 'PAGE::SET_TABS';
export const SET_ACTIVE_TAB = 'PAGE::SET_ACTIVE_TAB';
export const PAGE_SHOW_TABS = 'PAGE::SHOW_TABS';

/* Notification */
export const ADD_NOTIFICATION = 'PAGE::ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'PAGE::REMOVE_NOTIFICATION';
/* SLA */
export const SET_SLA_SIDE_BAR = 'SLA::SET_SIDE_BAR';
export const SLA_SET_FILTER = 'SLA::SET_FILTER';
export const SLA_SET_SEARCH = 'SLA::SET_SEARCH';
export const SLA_CHANGE_MODE_EDIT = 'SLA::CHANGE_MODE_EDIT';
export const SLA_CHANGE_PAGE = 'SLA::CHANGE_PAGE';

export const SLA_INIT_SLA = 'SLA::INIT_SLA';
export const SLA_RESET_SLA = 'SLA::RESET_SLA';
export const SLA_ACTIVATE = 'SLA::ACTIVATE';
export const SLA_INACTIVATE = 'SLA::INACTIVATE';
export const SLA_REMOVE = 'SLA::REMOVE';
export const SLA_COPY = 'SLA::COPY';
export const SLA_PUBLISH = 'SLA::PUBLISH';