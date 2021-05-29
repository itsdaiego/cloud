import fetch from 'node-fetch'


const hostname = 'http://localhost:80'

fetch(hostname, {
  method: 'POST',
  body: JSON.stringify({
    name: 'hello',
    code: 'process.stdout.write("HELLO"); process.stdout.write("HELLO");'
  }),
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // RETURN
}).then((res) => {
  console.log(res.status)
})
