const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const app = express()

console.log('here we are')
app.use(express.json())
app.use(cors())

app.use('/', routes)

app.listen('3001', () => {
  console.log('running on port 3001')
})
