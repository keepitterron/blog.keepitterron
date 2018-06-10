// Create an app
const util = require('util');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const showdown = require('showdown');
const handlebars = require('handlebars');
const postReader = require('./lib/PostReader');

fs.readFileAsync = util.promisify(fs.readFile);
fs.readDirAsync = util.promisify(fs.readdir);

const SNOWDOWN_CONFIG = {
  simplifiedAutoLink: true,
  tasklists: true,
  simpleLineBreaks: true,
};

const distPath = '/Users/claudio/Documents/personal/stout/dist/';
const postPath = [__dirname, 'posts/'].join('/');
const templatePath = [__dirname, 'views', 'index.html'].join('/');

const Converter = new showdown.Converter(SNOWDOWN_CONFIG);
const PostReader = new postReader(fs, matter);

rimraf(distPath);
fs.mkdirSync(distPath);

const templateContent = fs.readFileSync(templatePath, 'utf8');
const templateFn = handlebars.compile(templateContent);
PostReader.getAll(postPath).then(posts => {
  writeList(posts);
  posts.map(writeOne);
});

function writeList(posts) {
  const postListMd = posts.map(data => {
    const {title, date} = data.data;
    return `- [${title}](${data.fileName}) [${date}]`;
  }).join('\n');

  const title = '. posts'
  const html = Converter.makeHtml(postListMd);
  const template = templateFn({title, html});
  fs.writeFile(distPath + 'index.html', template, () => {});
}

function writeOne(post) {
  const html = Converter.makeHtml(post.content);
  const { title } = post.data;
  const template = templateFn({title, html});
  fs.mkdir(distPath + post.fileName, (err) => {
    fs.writeFile(distPath + post.fileName + '/index.html', template, () => {});
  })
}

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
  if (fs.existsSync(dir_path)) {
      fs.readdirSync(dir_path).forEach(function(entry) {
          var entry_path = path.join(dir_path, entry);
          if (fs.lstatSync(entry_path).isDirectory()) {
              rimraf(entry_path);
          } else {
              fs.unlinkSync(entry_path);
          }
      });
      fs.rmdirSync(dir_path);
  }
}
