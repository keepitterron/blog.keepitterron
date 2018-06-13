// Create an app
const matter = require('gray-matter');
const showdown = require('showdown');
const postReader = require('./lib/PostReader');
const postModel = require('./lib/PostModel');
const fs = require('./lib/fsExtra');
const template = require('./lib/template');

const distPath = [__dirname, '../dist/'].join('/');
const postPath = [__dirname, 'posts/'].join('/');
const templatePath = [__dirname, 'views', 'index.html'].join('/');

const PostReader = new postReader(fs, matter);
const PostModel = new postModel(showdown.Converter);

fs.rimraf(distPath);
fs.mkdirSync(distPath);

const templateFn = template(templatePath);
PostReader
  .getAll(postPath)
  .then(writeList)
  .then(posts => posts.map(writeOne));

function writeList(posts) {
  const templateData = PostModel.toList(posts);
  fs.writeFile(distPath + 'index.html', templateFn(templateData), () => {});
  return posts;
}

function writeOne(post) {
  const templateData = PostModel.toSingle(post);
  const path = distPath + post.fileName;

  fs.mkdir(path, (err) => {
    if(err) return; // TODO: handle errors
    fs.writeFile(path + '/index.html', templateFn(templateData), () => {});
  })
}
