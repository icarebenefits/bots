export const TIME_RANGE_CONST = {
  quick: {
    ranges: [
      [
        { from: 'now/d',    to: 'now/d',    label: 'Today' },
        { from: 'now/w',    to: 'now/w',    label: 'This week'},
        { from: 'now/M',    to: 'now/M',    label: 'This month' },
        { from: 'now/y',    to: 'now/y',    label: 'This year' },
        { from: 'now/d',    to: 'now',      label: 'The day so far' },
        { from: 'now/w',    to: 'now',      label: 'Week to date' },
        { from: 'now/M',    to: 'now',      label: 'Month to date' },
        { from: 'now/y',    to: 'now',      label: 'Year to date' },
      ],
      [
        { from: 'now-1d/d', to: 'now-1d/d', label: 'Yesterday' },
        { from: 'now-2d/d', to: 'now-2d/d', label: 'Day before yesterday' },
        { from: 'now-7d/d', to: 'now-7d/d', label: 'This day last week' },
        { from: 'now-1w/w', to: 'now-1w/w', label: 'Previous week' },
        { from: 'now-1M/M', to: 'now-1M/M', label: 'Previous month' },
        { from: 'now-1y/y', to: 'now-1y/y', label: 'Previous year' },
      ],
      [
        { from: 'now-15m',  to: 'now',      label: 'Last 15 minutes' },
        { from: 'now-30m',  to: 'now',      label: 'Last 30 minutes' },
        { from: 'now-1h',   to: 'now',      label: 'Last 1 hour' },
        { from: 'now-4h',   to: 'now',      label: 'Last 4 hours' },
        { from: 'now-12h',  to: 'now',      label: 'Last 12 hours' },
        { from: 'now-24h',  to: 'now',      label: 'Last 24 hours' },
        { from: 'now-7d',   to: 'now',      label: 'Last 7 days' },
      ],
      [
        { from: 'now-30d',  to: 'now',      label: 'Last 30 days' },
        { from: 'now-60d',  to: 'now',      label: 'Last 60 days' },
        { from: 'now-90d',  to: 'now',      label: 'Last 90 days' },
        { from: 'now-6M',   to: 'now',      label: 'Last 6 months' },
        { from: 'now-1y',   to: 'now',      label: 'Last 1 year' },
        { from: 'now-2y',   to: 'now',      label: 'Last 2 years' },
        { from: 'now-5y',   to: 'now',      label: 'Last 5 years' },
      ]
    ],
    buttons: [
      {name: 'quick', label: 'Quick'},
      {name: 'relative', label: 'Relative'},
      {name: 'absolute', label: 'Absolute'}
    ]
  },
  relative: {
    options: [
      { label: 'Minutes ago', name: 'm' },
      { label: 'Hours ago', name: 'h' },
      { label: 'Days ago', name: 'd' },
      { label: 'Weeks ago', name: 'w' },
      { label: 'Months ago', name: 'M' },
      { label: 'Years ago', name: 'y' },
    ]
  }
};

export const COUNTRY_CONST = {
  buttons: [
    {name: 'all', label: 'All'},
    {name: 'vn', label: 'Vietnam'},
    {name: 'kh', label: 'Cambodia'},
    {name: 'la', label: 'Laos'}
  ]
};

export const NAV_CONST = {
  tabs: [
    {name: 'save', label: 'Save', icon: 'fa-save'},
    {name: 'open', label: 'Open', icon: 'fa-folder-open'},
    // {name: 'refresh', label: 'Refresh', icon: 'fa-refresh'},
    {name: 'country', label: 'Vietnam', icon: 'fa-globe'},
    {name: 'timeRange', label: 'Today', icon: 'fa-clock-o'}
  ]
};