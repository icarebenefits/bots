
export const Periods = [
  'seconds',
  'minutes',
  'hours',
  'day',
  'day of the month',
  'day of the week',
  'day of the year',
  'week',
  'week of the year',
  'month',
  'year',
];

export const NumbersRange = [
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
  '11st', '12nd', '13rd', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
  '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th',
];

export const Times = {
  hour: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
  ],
  minute: [
    '00', '10', '20', '30', '40', '50'
  ]
};

export const Days = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const Months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'Semptember', 'October', 'November', 'December',
];

export const Years = [
  '2017', '2018', '2019', '2020',
];

const RangePeriods = NumbersRange.map(number => {
  return {[`${number}`]: Periods}
});

const Schema = {
  'on the': {
    ...RangePeriods,
    first: Periods,
    last: Periods,
  },
  'every': {
    'weekend': 'weekend',
    'weekday': 'weekday',
  },
  'after': {
    ...RangePeriods,
    time: Times,
  },
  'before': {
    ...RangePeriods,
    time: Times,
  },
  'at': {
    ...Times,
  },
  'on': {

  },
  'of': {},
  'in': {},
};

export default Schema

