const fs = require('fs');
const url = require('url');
const http = require('http');
const https = require('https');
const { StringDecoder } = require('string_decoder');

const requestHandler = (req, res) => {
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
  let buffer = '';

  // A "data" event is emmited each time a stream is received
  req.on('data', data => {
    buffer += decoder.write(data)
  });

  // After all streams have been received, an "end" event is emmited
  req.on('end', () => {
    buffer += decoder.end()
    const handler = typeof(router[trimmedPath]) == 'undefined' ? handlers.notFound : router[trimmedPath];

    const data = {
      path,
      method,
      headers,
      trimmedPath,
      queryStringObject,
      payload: buffer,
    };

    handler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = JSON.stringify(typeof(payload) == 'object' ? payload : {});

      res.writeHead(statusCode, {
        'Content-Type': 'application/json'
      });

      // We could also set the header by using setHeader
      // res.setHeader('Content-Type', 'application/json');

      res.end(payload);

      console.log('Returning response: ', statusCode, payload);
    });

  });
}

const httpServer = http.createServer(requestHandler);

const httpsOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsOptions, requestHandler);

httpServer.listen(3000, () => {
  console.log('HTTP server listening on port 3000!');
});

httpsServer.listen(3001, () => {
  console.log('HTTPS server listening on port 3001!');
});

const handlers = {
  sample(data, callback) {
    callback(200, {name: 'sample handler'})
  },

  notFound(data, callback) {
    callback(404)
  }
}

const router = {
  sample: handlers.sample
};
