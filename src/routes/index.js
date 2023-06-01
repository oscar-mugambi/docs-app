const express = require('express')
const { getDriveFolders, accessDb, downloadFiles, readFiles } = require('../controller/getDocs')
require('dotenv').config()
const router = express.Router() // eslint-disable-line new-cap

router.get('/health-check', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'we good',
  })
})

router.route('/docs').get(getDriveFolders)
router.route('/db').get(accessDb)
router.route('/downloadFiles').get(downloadFiles)
router.route('/readFiles').get(readFiles)

module.exports = router
