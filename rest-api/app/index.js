const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Required to decode the streams of data
  // from the HTTP request into string
  const decoder = new StringDecoder('utf-8');
  const buffer = '';

  // A "data" event is emmited each time a stream is received
  req.on('data', data => {
    buffer += decoder.write(data)
  });

  // After all streams have been received, an "end" event is emmited
  req.on('end', () => {
    buffer += decoder.end()

    console.log('Request received with this payload: ', buffer);
    res.end(`Hello World from /${ trimmedPath }\n`);
  });

});

server.listen(3000, () => {
  console.log('Server listening on!');
});
