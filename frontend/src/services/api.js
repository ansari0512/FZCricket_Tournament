import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fzcricket-backend.onrender.com/api',
})

API.interceptors.request.use((config) => {
  // Use adminToken for admin endpoints, fzToken for user endpoints
  const url = config.url || ''
  const method = (config.method || 'get').toUpperCase()
  const isAdminEndpoint = url.includes('/admin/') || 
                          url.startsWith('/auth/admin/') ||
                          url === '/teams/all' ||
                          url === '/payment/all' ||
                          url === '/config' ||
                          url === '/score/update' ||
                          url === '/matches/generate-schedule' ||
                          url.startsWith('/matches/create') ||
                          (url.startsWith('/matches/') && (url.includes('/status') || url.includes('/score') || url.includes('/delete'))) ||
                          (url.startsWith('/players/') && (method === 'DELETE' || url.includes('/delete'))) ||
                          url === '/gallery' && method === 'POST' ||
                          (url.startsWith('/gallery/') && (method === 'DELETE' || url.includes('/delete'))) ||
                          (url.startsWith('/teams/') && method === 'DELETE')
  const token = isAdminEndpoint 
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('fzToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD || ''
export const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || ''
export const CLOUDINARY_PLAYERS_PRESET = import.meta.env.VITE_CLOUDINARY_PLAYERS_PRESET || ''
export const CLOUDINARY_PAYMENTS_PRESET = import.meta.env.VITE_CLOUDINARY_PAYMENTS_PRESET || 'fzcricket_payments'

const cloudinaryUpload = async (file, preset, folder, onProgress) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', preset)
  if (folder) fd.append('folder', `fzcricket/${folder}`)
  const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, fd, {
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total))
    }
  })
  return res.data.secure_url
}

export const uploadImage = (file, folder, onProgress) =>
  cloudinaryUpload(file, CLOUDINARY_PLAYERS_PRESET, folder, onProgress)

export const uploadGalleryImage = (file, onProgress) =>
  cloudinaryUpload(file, CLOUDINARY_PRESET, null, onProgress)

export const uploadPaymentScreenshot = (file, onProgress) =>
  cloudinaryUpload(file, CLOUDINARY_PAYMENTS_PRESET, 'payments', onProgress)

export const SOCKET_URL = (import.meta.env.VITE_API_URL || 'https://fzcricket-backend.onrender.com/api').replace('/api', '')

export const getPaymentConfig = () => API.get('/config/payment')

// Auth
export const googleLogin = (data) => API.post('/auth/google-login', data)
export const updateMobile = (data) => API.put('/auth/update-mobile', data)
export const getMe = () => API.get('/auth/me')
export const getNotifications = () => API.get('/auth/notifications')
export const markNotificationsRead = () => API.put('/auth/notifications/read')
export const adminLogin = (data) => API.post('/auth/admin/login', data)
export const getAdminUsers = () => API.get('/auth/admin/users')
export const deleteAdminUser = (userId) => API.delete(`/auth/admin/users/${userId}`)

// Teams
export const getTeams = () => API.get('/teams')
export const getAllTeams = () => API.get('/teams/all')
export const getTeam = (id) => API.get(`/teams/${id}`)
export const registerTeam = (data) => API.post('/teams/register', data)
export const updateTeam = (id, data) => API.put(`/teams/${id}`, data)
export const deleteTeam = (id) => API.delete(`/teams/${id}`)
export const getTeamPlayers = (id) => API.get(`/teams/${id}/players`)

// Players
export const registerPlayer = (teamId, data) => API.post(`/players/register/${teamId}`, data)
export const updatePlayer = (id, data) => API.put(`/players/${id}`, data)
export const deletePlayer = (id) => API.delete(`/players/${id}`)

// Matches
export const getMatches = () => API.get('/matches')
export const createMatch = (data) => API.post('/matches/create', data)
export const updateMatchStatus = (id, data) => API.put(`/matches/${id}/status`, data)
export const updateMatchScore = (id, data) => API.put(`/matches/${id}/score`, data)
export const generateSchedule = () => API.post('/matches/generate-schedule')
export const deleteMatch = (id) => API.delete(`/matches/${id}`)

// Gallery
export const getGallery = () => API.get('/gallery')
export const addGalleryPhoto = (data) => API.post('/gallery', data)
export const deleteGalleryPhoto = (id) => API.delete(`/gallery/${id}`)

export default API
