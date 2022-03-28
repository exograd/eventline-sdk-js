#!/usr/bin/env node

const ev = require("eventline")

ev.run(async function(_client, context) {
  console.log(context)
})
