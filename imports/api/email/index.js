import {Meteor} from 'meteor/meteor';

export const buildEmailHTML = (template, data) => {
  const emailTemplateBuilder = require('email-template-builder');
  let mailTemplate = "";

  data.slogan = Meteor.settings.public.slogan;
  switch (template) {
    case "notification": {
      mailTemplate = Assets.getText(`templates/email/monitor/${template}.html`);
      break;
    }
    case "invitation":
    default: {
      mailTemplate = Assets.getText(`templates/email/${template}.html`);
    }
  }
  return emailTemplateBuilder.generate(data, mailTemplate);
};
