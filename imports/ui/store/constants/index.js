
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
    {id: 'edit', icon: 'fa fa-pencil', label: 'Edit SLA'},
    {id: 'view', icon: 'fa fa-circle', label: 'View SLA'}
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
/* LIST */
export const LISTS = {
  listSLA: {
    headers: ['Name', 'Workplace', 'Frequency', 'Last Execution'],
    actions: [
      {
        id: 'edit', label: 'Edit',
        icon: 'fa fa-pencil', className: 'btn-primary'
      },
      {id: 'inactivate', label: 'Inactivate', className: 'yellow'},
      {id: 'activate', label: 'Activate', className: 'green'},
      {
        id: 'remove', label: '',
        icon: 'fa fa-times', className: 'btn-danger'
      }
    ]
  }
};

/* ACTION TYPES */

/* Page Control */
export const SET_COUNTRY = 'PAGE::SET_COUNTRY';
export const SET_SLOGAN = 'PAGE::SET_SLOGAN';
export const SET_USER_PICTURE = 'PAGE::SET_USER_PICTURE';
export const SET_USER_FULL_NAME = 'PAGE::SET_USER_FULL_NAME';
export const SET_TABS = 'PAGE::SET_TABS';
export const SET_ACTIVE_TAB = 'PAGE::SET_ACTIVE_TAB';
/* SLA */
export const SET_SLA_SIDE_BAR = 'SLA::SET_SIDE_BAR';
export const SLA_CHANGE_MODE = 'SLA::CHANGE_MODE';
export const SLA_SET_FILTER = 'SLA::SET_FILTER';
export const SLA_SET_SEARCH = 'SLA::SET_SEARCH';