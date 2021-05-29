import express from 'express'

const PORT = 8080

const app = express()

app.use('/', (req, res, next) => {
  const { url, method, hostname, subdomains } = req
  console.log(url, method, hostname, subdomains)
  next()
})

app.get('/', (req, res) => {
  const { url, method, subdomains } = req
  res.send(subdomains.join(', '))
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
