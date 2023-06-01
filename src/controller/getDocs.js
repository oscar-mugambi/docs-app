const { google } = require('googleapis')
const { GoogleAuth } = require('google-auth-library')
require('dotenv').config()
const db = require('../db')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function accessDb(req, res) {
  const results = await db.query('select * from Records')
  return res.status(200).json({
    data: {
      docs: results.rows,
    },
  })
}

async function deleteItemsInDB() {
  const results = await db.query('select * from Records')
  if (results.rows.length) {
    await db.query('delete from Records')
    console.log('deleted records from table')
  }

  return
}

async function saveToDB(folders) {
  for (const doc of folders) {
    const query = 'INSERT INTO Records (name, doc) VALUES ($1, $2)'
    const values = [doc.name, doc.id]
    try {
      const results = await db.query(query, values)
      console.log('Data inserted successfully.')
    } catch (error) {
      console.error('Error inserting data:', error)
    }
  }
}

async function logger(file, name) {
  try {
    await fsPromises.writeFile(path.join(__dirname, '..', 'records', `${name}.txt`), file.data)
  } catch (error) {}
}

async function readFiles(req, res) {
  const findBelly = /\bBelly\b/g
  const findNumber2 = /(?<=>)(.*)/
  const file = path.join(__dirname, '..', 'records', 'Week 1.txt')
  let value = []
  fs.readFile(file, 'utf-8', (err, data) => {
    const fileLines = data.split('\n')
    for (const line of fileLines) {
      const match = line.match(findBelly)
      if (match) {
        const number = line.match(findNumber2)
        if (number) value.push(number[0])
      }
    }
    return res.json(value)
  })
}

async function downloadFiles(req, res) {
  const service = google.drive({ version: 'v3', auth: oauth2Client })
  const query = 'select * from Records'
  const results = await db.query(query)

  for (const doc of results.rows) {
    // console.log(doc)
    try {
      const file = await service.files.export({
        fileId: doc.doc,
        mimeType: 'text/plain',
      })

      logger(file, doc.name)
    } catch (err) {
      // TODO(developer) - Handle error
      console.log(err.message)
      return res.status(400).json({
        error: err,
      })
    }
  }

  return res.status(200).json({
    data: true,
  })
}

async function getDriveFolders(req, res) {
  try {
    // Create an instance of the Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const response = await drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.document' and name contains 'week' and modifiedTime > '2023-02-10T12:00:00'",
      fields: 'files(id, name)',
    })
    const folders = response.data.files || []
    if (!folders?.length)
      return res.status(200).json({
        data: [],
      })

    //delete all items in db if they exist
    await deleteItemsInDB()

    //save items to DB
    await saveToDB(folders)

    return res.status(200).json({
      data: folders,
    })
  } catch (error) {
    console.log('Error fetching Google Drive folders:', error.message)
    return res.status(500).json({
      error: error.message,
    })
  }
}

module.exports = { getDriveFolders, accessDb, downloadFiles, readFiles }
