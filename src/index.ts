import express from 'express'
import { spawn } from 'child_process'
import { json as bodyParserJSON } from 'body-parser'
import * as assert from 'assert'

const _SUBDOMAIN_TO_PORT: {
  [subdomain: string]: number
} = {}

type ContainerOpt = {
  name: string
  code: string
}

function escape(str: string): string {
  return str.replace(/"/g, '\\"')
}

assert.strictEqual(escape('console.log("foo")'), 'console.log(\\"foo\\")')

async function createContainer(opt: ContainerOpt) {
  const { name, code } = opt

  const _process = spawn(
    'docker',
    [
      'run',
      '-a',
      'stdin',
      '-a',
      'stdout',
      '-a',
      'stderr',
      '-e',
      `CODE=${code}`,
      '--name',
      name,
      'app',
    ],
    {
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  )

  _process.on('close', (code, signal) => {
    console.log('close', code, signal)
  })

  // _process.stdin.on('error', (e) => {
  //   console.log('error', e)
  // })

  _process.stderr.on('data', (data) => {
    console.log('stderr', 'data', data.toString())
  })

  _process.stdout.on('data', (data) => {
    console.log('stdout', 'data', data.toString())
  })
}

async function deleteContainer(name: string) {
  spawn('docker', ['rm', name])
}

const PORT = 80

const app = express()

app.use('/', (req, res, next) => {
  const { url, method, hostname, subdomains } = req
  console.log(url, method, hostname, subdomains)
  next()
})

app.get('/', (req, res) => {
  const { url, method, hostname, subdomains } = req
  res.send(hostname)
})

app.post('/', bodyParserJSON())

app.post('/', async (req, res) => {
  const { url, method, hostname, subdomains, body } = req

  const { name, code } = body

  // _SUBDOMAIN_TO_PORT[name] = 

  await createContainer({ name, code })

  res.send()
})

app.delete('/', async (req, res) => {
  const { url, method, hostname, subdomains, body } = req

  // TODO

  res.send('TODO')
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
