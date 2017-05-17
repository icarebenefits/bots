
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
  ]
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

/* ACTION TYPES */

/* Page Control */
export const SET_COUNTRY = 'PAGE::SET_COUNTRY';
export const SET_SLOGAN = 'PAGE::SET_SLOGAN';
export const SET_TABS = 'PAGE::SET_TABS';
export const SET_ACTIVE_TAB = 'PAGE::SET_ACTIVE_TAB';

/* Notification */
export const ADD_NOTIFICATION = 'PAGE::ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'PAGE::REMOVE_NOTIFICATION';
/* SLA */
export const SET_SLA_SIDE_BAR = 'SLA::SET_SIDE_BAR';
export const SLA_SET_FILTER = 'SLA::SET_FILTER';
export const SLA_SET_SEARCH = 'SLA::SET_SEARCH';
export const SLA_CHANGE_MODE_EDIT = 'SLA::CHANGE_MODE_EDIT';

export const SLA_INIT_SLA = 'SLA::INIT_SLA';
export const SLA_RESET_SLA = 'SLA::RESET_SLA';
export const SLA_ACTIVATE = 'SLA::ACTIVATE';
export const SLA_INACTIVATE = 'SLA::INACTIVATE';
export const SLA_REMOVE = 'SLA::REMOVE';
export const SLA_VALIDATE = 'SLA::VALIDATE';
export const SLA_PREVIEW = 'SLA::PREVIEW';
export const SLA_SAVE = 'SLA::SAVE';
export const SLA_SAVE_EXECUTE = 'SLA::SAVE_EXECUTE';
export const SLA_CANCEL = 'SLA::CANCEL';