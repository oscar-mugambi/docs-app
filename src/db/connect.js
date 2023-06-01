require('dotenv').config()
module.exports = function () {
  let mysql = require('mysql2')
  let connCreds = require('../config')
  //Establish Connection to the DB
  let connection = mysql.createConnection(connCreds.DATABASE_URL)

  //Instantiate the connection
  connection.connect(function (err) {
    if (err) {
      console.log(`connectionRequest Failed ${err.stack}`)
    } else {
      console.log(`DB connectionRequest Successful ${connection.threadId}`)
    }
  })
  //return connection object
  return connection
}
