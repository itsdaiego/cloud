const http = require('http')
const { fork } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    if (req.method === 'POST') {
      // TODO: should terminate process as well (during server termination)
      const child = fork('runtime')

      // child.on('message', (m) => {
      // });

      let code = '';

      req.on('data', function (chunk) {
        code += chunk;
      });

      req.on('end', function () {
        child.send(code)
      });
      res.writeHead(200);
      res.end(String(child.pid));
    }
  }
})

server.listen(3164)
