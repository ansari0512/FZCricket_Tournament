const jwt = require('jsonwebtoken')
const admin = require('./firebaseAdmin')

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set')

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.user = { userId: decoded.uid, email: decoded.email, name: decoded.name, photo: decoded.picture }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { verifyAdmin, verifyUser }
