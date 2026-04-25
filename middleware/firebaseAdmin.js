const admin = require('firebase-admin')

if (!admin.apps.length) {
  let credential

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      // Render.com mein \n escape ho jaata hai - fix karo
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
      }
      credential = admin.credential.cert(serviceAccount)
    } catch (err) {
      console.error('Firebase service account parse error:', err.message)
      process.exit(1)
    }
  } else {
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
  console.log('Firebase Admin initialized successfully')
}

module.exports = admin
