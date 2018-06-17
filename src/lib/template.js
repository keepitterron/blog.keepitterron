// Create an app
const handlebars = require('handlebars');
const path = require('path');
const fs = require('./fsExtra');

const partialsPath = path.join(__dirname, '../views/');
const _header = fs.readFileSync(partialsPath + '_header.hbr').toString();
handlebars.registerPartial('header', _header);

const templateFn = (templatePath) => {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  return handlebars.compile(templateContent);
};
module.exports = templateFn;
