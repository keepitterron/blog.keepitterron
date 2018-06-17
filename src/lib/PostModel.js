const showdownHighlight = require('showdown-highlight');

const SNOWDOWN_CONFIG = {
  simplifiedAutoLink: true,
  tasklists: true,
  simpleLineBreaks: true,
  extensions: [showdownHighlight],
};

class PostModel {
  constructor(converter) {
    this.converter = new converter(SNOWDOWN_CONFIG);
  }

  toList(posts) {
    return { posts };
  }

  toSingle(post) {
    const html = this.converter.makeHtml(post.content);
    const { title } = post.data;
    return { title, html, post };
  }
}

module.exports = PostModel;
