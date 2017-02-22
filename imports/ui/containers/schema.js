import classification from './classification';

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