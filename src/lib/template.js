// Create an app
const handlebars = require('handlebars');
const fs = require('./fsExtra');

const templateFn = (templatePath) => {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  return handlebars.compile(templateContent);
};
module.exports = templateFn;
