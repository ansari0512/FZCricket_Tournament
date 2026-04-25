import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fzcricket-backend.onrender.com/api',
})

API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken')
  const userToken = localStorage.getItem('fzToken')
  const token = adminToken || userToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD || ''
export const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || ''
export const CLOUDINARY_PLAYERS_PRESET = import.meta.env.VITE_CLOUDINARY_PLAYERS_PRESET || ''
export const CLOUDINARY_PAYMENTS_PRESET = import.meta.env.VITE_CLOUDINARY_PAYMENTS_PRESET || 'fzcricket_payments'

export const uploadImage = async (file, folder = null) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PLAYERS_PRESET)
  if (folder) fd.append('folder', `fzcricket/${folder}`)
  const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, fd)
  return res.data.secure_url
}

export const uploadGalleryImage = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PRESET)
  const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, fd)
  return res.data.secure_url
}

export const uploadPaymentScreenshot = async (file) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', CLOUDINARY_PAYMENTS_PRESET)
  const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, fd)
  return res.data.secure_url
}

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const adminLogin = (data) => API.post('/auth/admin/login', data)
export const getNotifications = (userId) => API.get(`/auth/notifications/${userId}`)
export const markNotificationsRead = (userId) => API.put(`/auth/notifications/${userId}/read`)
export const changePassword = (userId, data) => API.put(`/auth/change-password/${userId}`, data)
export const getAdminUsers = () => API.get('/auth/admin/users')
export const deleteAdminUser = (userId) => API.delete(`/auth/admin/users/${userId}`)
export const resetUserCredentials = (userId, data) => API.put(`/auth/admin/users/${userId}/reset`, data)

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

// Gallery
export const getGallery = () => API.get('/gallery')
export const addGalleryPhoto = (data) => API.post('/gallery', data)
export const deleteGalleryPhoto = (id) => API.delete(`/gallery/${id}`)

export default API
