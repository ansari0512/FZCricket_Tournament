const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

if (!admin.apps.length) {
  let serviceAccount = null

  // 1. Try env var first
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      let str = process.env.FIREBASE_SERVICE_ACCOUNT
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\t/g, '')
      serviceAccount = JSON.parse(str)
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
      }
      console.log('Firebase: loaded from env var')
    } catch (err) {
      console.warn('Firebase env var parse failed:', err.message)
    }
  }

  // 2. Try Render secret file path
  if (!serviceAccount) {
    const renderPath = '/etc/secrets/firebase-service-account.json'
    if (fs.existsSync(renderPath)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
        console.log('Firebase: loaded from Render secret file')
      } catch (err) {
        console.warn('Firebase Render secret file parse failed:', err.message)
      }
    }
  }

  // 3. Try local project file
  if (!serviceAccount) {
    const localPath = path.join(__dirname, '../firebase-service-account.json')
    if (fs.existsSync(localPath)) {
      try {
        serviceAccount = JSON.parse(fs.readFileSync(localPath, 'utf8'))
        console.log('Firebase: loaded from local file')
      } catch (err) {
        console.warn('Firebase local file parse failed:', err.message)
      }
    }
  }

  if (!serviceAccount) {
    console.error('Firebase: no valid service account found')
    process.exit(1)
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  console.log('Firebase Admin initialized successfully')
}

module.exports = admin
