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
    const postListMd = posts.map(data => {
      const { title } = data.data;
      const { date, fileName } = data;
      return `- [${title}](./${fileName}) [${date}]`;
    }).join('\n');

    const title = 'Post Archive'
    const html = this.converter.makeHtml(postListMd);
    return { title, html };
  }

  toSingle(post) {
    const html = this.converter.makeHtml(post.content);
    const { title } = post.data;
    return { title, html };
  }
}

module.exports = PostModel;
