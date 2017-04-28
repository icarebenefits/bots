/**
 * COUNTRY CONSTANTS
 * @type {string[]}
 */
export const COUNTRIES = [
  'vn',
  'kh',
  'la',
];

/**
 * Format message with markdown
 * @param message
 * @param heading1
 * @param heading2
 * @param bold
 * @param link
 * @param code
 * @return {*}
 */
export const formatMessage = ({message = '', heading1, heading2, bold, link, code}) => {
  let newMess = message;

  (heading1) && (newMess = `${newMess} \n ## ${heading1}`);
  (heading2) && (newMess = `${newMess} \n # ${heading2}`);
  (bold) && (newMess = `${newMess} \n **${bold}**`);
  (link) && (newMess = `${newMess} \n [${link.title}](${link.link})`);
  if(code) {
    const c = JSON.stringify(code);
    newMess = `${newMess} \n \`\`\` \n ${c} \n \`\`\``;
  };

  return newMess;
};