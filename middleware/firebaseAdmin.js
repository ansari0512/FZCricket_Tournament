const admin = require('firebase-admin')

if (!admin.apps.length) {
  let credential

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Render environment variable se
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    credential = admin.credential.cert(serviceAccount)
  } else {
    // Local file se (development)
    try {
      const path = require('path')
      const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'))
      credential = admin.credential.cert(serviceAccount)
    } catch {
      console.error('Firebase service account not found')
      process.exit(1)
    }
  }

  admin.initializeApp({ credential })
}

module.exports = admin
