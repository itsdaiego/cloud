globalThis.process.on('message', (code) => {
  console.log('CHILD got message:', eval(code));

  eval(code)
});
