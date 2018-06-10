class PostReader {
  constructor(fs, matter) {
    this.fs = fs;
    this.matter = matter;
  }

  getAll(postsPath) {
    return this.fs.readDirAsync(postsPath)
      .then(files => this.getPostsWithContent(postsPath, files))
      .then(filePromises => Promise.all(filePromises))
      .then(fileList => this.parseList(fileList))
      .then(this.sortListByNewest)
      .catch(console.log);
  }

  getOne(filePath) {
    return this.getPostRaw(filePath).then(post => this.parseOne(post));
  }

  parseOne(post) {
    const parsed = this.matter(post.content);
    const date = new Date(parsed.data.date);
    const fileName = post.file.replace('.md', '');

    return Object.assign({date, fileName}, parsed);
  }

  parseList(postList) {
    return postList.map(list => this.parseOne(list));
  }

  sortListByNewest(postList) {
    postList.sort((a, b) => {
      if( a.date > b.date ) return -1;
      if( a.date < b.date ) return 1;
      return 0;
    });

    return postList;
  }

  getPostsWithContent(postsPath, files) {
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => this.getPostRaw(postsPath + file));
  }

  getPostRaw(filePath) {
    const file = filePath.split('/').pop();
    return this.fs.readFileAsync(filePath, 'utf8')
      .then(content => ({content, file}));
  }

}

module.exports = PostReader;
