const express = require('express')
const cors = require('cors')
const routes = require('./routes')
require('dotenv').config()
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use('/', routes)

app.listen(port, () => {
  console.log('running on port ' + port)
})
