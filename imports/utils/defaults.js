export const COUNTRIES = [
  'vn',
  'kh',
  'la',
];

export const formatMessage = ({message, heading1, heading2, bold, link, code}) => {
  let newMess = message;
  (heading1) && (newMess = `${newMess} \n ## ${heading1}`);
  (heading2) && (newMess = `${newMess} \n # ${heading2}`);
  (bold) && (newMess = `${newMess} \n **${bold}**`);
  (link) && (newMess = `${newMess} \n [${link.title}](${link.link})`);
  (code) && (newMess = `${newMess} \n \`\`\`${JSON.stringify(code, null, 2)} \n \`\`\``);

  return newMess;
};