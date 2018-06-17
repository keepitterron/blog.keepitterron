// Create an app
const matter = require('gray-matter');
const showdown = require('showdown');
const uglifycss = require('uglifycss');
const postReader = require('./lib/PostReader');
const postModel = require('./lib/PostModel');
const fs = require('./lib/fsExtra');
const template = require('./lib/template');

const distPath = [__dirname, '../dist/'].join('/');
const postPath = [__dirname, 'posts/'].join('/');
const templateListPath = [__dirname, 'views', 'list.hbr'].join('/');
const templateSinglePath = [__dirname, 'views', 'single.hbr'].join('/');
const cssPath = [__dirname, 'views', 'index.css'].join('/');

const PostReader = new postReader(fs, matter);
const PostModel = new postModel(showdown.Converter);

fs.rimraf(distPath);
fs.mkdirSync(distPath);

const templateFn = {
  list: template(templateListPath),
  single: template(templateSinglePath),
};
PostReader
  .getAll(postPath)
  .then(writeList)
  .then(posts => posts.map(writeSingle));

function writeList(posts) {
  templateToFile({
    filePath: distPath + 'index.html',
    data: PostModel.toList(posts),
    templateFn: templateFn.list,
  });
  return posts;
}

function writeSingle(post) {
  const path = distPath + post.fileName;

  fs.mkdir(path, (err) => {
    if(err) return; // TODO: handle errors
    templateToFile({
      filePath: path + '/index.html',
      data: PostModel.toSingle(post),
      templateFn: templateFn.single,
    });
  })
}

function templateToFile({filePath, data, templateFn}) {
  const uglifyOptions = { maxLineLen: 500, expandVars: true };
  const styleRaw = uglifycss.processFiles([cssPath], uglifyOptions);
  const templateData = Object.assign({}, data, {styleRaw});
  fs.writeFile(filePath, templateFn(templateData), () => {});
}
