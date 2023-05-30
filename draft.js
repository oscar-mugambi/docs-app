const { google } = require('googleapis')
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function getDriveFolders() {
  try {
    // Create an instance of the Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Fetch the folders from Google Drive
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder'",
      fields: 'files(id, name)',
    })

    // Extract the folder data from the response
    const folders = response.data.files

    // Log the fetched folders
    console.log('Google Drive Folders:')
    folders.forEach((folder) => {
      console.log(`Name: ${folder.name}, ID: ${folder.id}`)
    })
  } catch (error) {
    console.log('Error fetching Google Drive folders:', error.message)
  }
}

getDriveFolders()
