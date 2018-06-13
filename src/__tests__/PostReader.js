const postReader = require('../lib/PostReader');
const postPath = [__dirname, 'fixtures/'].join('/');

describe('PostReader', function() {

  let PostReader, fs, matter;
  const postData = {
    content: 'foo',
    file: 'foo.md',
  };
  const parsedData = {
    data: {
      date: '01/01/01'
    }
  }

  beforeEach(() => {
    const promise = Promise.resolve('foo');
    fs = {
      readDirAsync: jest.fn(),
      readFileAsync: jest.fn(),
    };
    matter = jest.fn();

    fs.readDirAsync.mockReturnValue(promise);
    fs.readFileAsync.mockReturnValue(promise);
    matter.mockReturnValue(parsedData);
    PostReader = new postReader(fs, matter);
  });

  it('parseOne', () => {
    const result = PostReader.parseOne(postData);
    const expected = Object.assign({
      date: new Date(parsedData.data.date),
      fileName: 'foo',
    }, parsedData);
    expect(matter).toHaveBeenCalledWith(postData.content);
    expect(result).toEqual(expected);
  })

  it('sortListByNewest', () => {
    const data = [
      {date: new Date('06/01/2018')},
      {date: new Date('06/01/2017')},
      {date: new Date('06/03/2018')},
      {date: new Date('05/01/2018')},
    ];

    const expected = [
      {date: new Date('06/03/2018')},
      {date: new Date('06/01/2018')},
      {date: new Date('05/01/2018')},
      {date: new Date('06/01/2017')},
    ];

    expect(PostReader.sortListByNewest(data)).toEqual(expected);
  });

  it('getPostsWithContent', () => {
    const files = [
      'foo',
      'bar.md',
      'bazmd',
      'qix.md5'
    ];
    const path = 'path/to/foo/';
    PostReader.getPostRaw = jest.fn();
    PostReader.getPostsWithContent(path, files);

    expect(PostReader.getPostRaw).toHaveBeenCalledWith('path/to/foo/bar.md');
  });

  it('getPostRaw', (done) => {
    const promise = PostReader.getPostRaw('path/to/foo.md');
    promise.then((data) => {
      expect(data).toEqual(postData);
      done();
    });
  });

});
