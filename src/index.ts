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

  const parsed = escape(code)

  const _process = spawn('docker', [
    'run',
    '-e',
    `CODE="${parsed}"`,
    '--name',
    name,
    'app',
  ])
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
