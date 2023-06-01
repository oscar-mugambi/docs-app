require('dotenv').config()

const { CLIENT_ID, CLIENT_SECRET, REFRESH_URI, REFRESH_TOKEN, PORT, DATABASE_URL } = process.env
module.exports = {
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_URI,
  REFRESH_TOKEN,
  PORT,
  DATABASE_URL,
}
