const admin = require('firebase-admin')
const path = require('path')

if (!admin.apps.length) {
  let credential

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      let serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT
      
      // Fix escaped newlines
      serviceAccountStr = serviceAccountStr.replace(/\\n/g, '\n')
      serviceAccountStr = serviceAccountStr.replace(/\\r/g, '\r')
      serviceAccountStr = serviceAccountStr.replace(/\\t/g, '\t')
      
      const serviceAccount = JSON.parse(serviceAccountStr)
      
      if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
      }
      
      credential = admin.credential.cert(serviceAccount)
      console.log('Firebase Admin initialized from env var')
    } catch (err) {
      console.warn('Firebase env var parse failed, trying file:', err.message)
      // Fallback to file
      try {
        const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'))
        credential = admin.credential.cert(serviceAccount)
        console.log('Firebase Admin initialized from file')
      } catch (fileErr) {
        console.error('Firebase service account file not found:', fileErr.message)
        process.exit(1)
      }
    }
  } else {
    try {
      const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'))
      credential = admin.credential.cert(serviceAccount)
      console.log('Firebase Admin initialized from file')
    } catch (err) {
      console.error('Firebase service account not found:', err.message)
      process.exit(1)
    }
  }

  admin.initializeApp({ credential })
  console.log('Firebase Admin initialized successfully')
}

module.exports = admin
