const argv = globalThis.process.argv
const { request } = require('http')
const { fork, exec } = require('child_process');

const inputs = argv.slice(2, argv.length)

const createProcess = (code) => {
  if (argv.includes('new')) {
  }
}


if (inputs[0] == 'start') {
  const child = fork('manager', { detached: true })
  console.log('pid child', child.pid);
  process.exit(0)
}

if (inputs[0] === 'new') {
  const code = inputs[1] || ''

  const req = request(
    {
      hostname: 'localhost',
      port: 3164,
      method: 'POST',
      path: '/',
    },
    (res) => {
      let pid = '';

      res.on('data', function (chunk) {
        pid += chunk;
      });

      res.on('end', function () {
        console.log(pid);
        // TODO: should figure out why it is blocking
        process.exit(0)
      });
    }
  )

  req.write(code)
  req.end()

  // req.on('error', (err) => {
  //   console.log('we dont  know what we re doing', err);
  // })
}

if (inputs[0] == 'stop') {
  exec('kill-port 3164')
  // process.exit(0)
}
