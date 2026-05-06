const admin = require('firebase-admin')

if (!admin.apps.length) {
  let credential

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      let serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT
      
      // Fix escaped newlines - try multiple patterns
      serviceAccountStr = serviceAccountStr.replace(/\\n/g, '\n')
      serviceAccountStr = serviceAccountStr.replace(/\\r/g, '\r')
      serviceAccountStr = serviceAccountStr.replace(/\\t/g, '\t')
      
      const serviceAccount = JSON.parse(serviceAccountStr)
      
      // Double-check private_key
      if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
      }
      
      credential = admin.credential.cert(serviceAccount)
    } catch (err) {
      console.error('Firebase service account parse error:', err.message)
      console.error('Env var length:', process.env.FIREBASE_SERVICE_ACCOUNT?.length)
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
