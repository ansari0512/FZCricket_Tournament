import axios from 'axios';

const api = axios.create({
    baseURL: 'https://your-backend-api-url.com/api', // Set your backend API URL here
});

// Function to handle teams
export const fetchTeams = () => api.get('/teams');
export const createTeam = (teamData) => api.post('/teams', teamData);

// Function to handle players
export const fetchPlayers = () => api.get('/players');
export const createPlayer = (playerData) => api.post('/players', playerData);

// Function to handle matches
export const fetchMatches = () => api.get('/matches');
export const createMatch = (matchData) => api.post('/matches', matchData);

// Function to handle scores
export const fetchScores = () => api.get('/scores');
export const createScore = (scoreData) => api.post('/scores', scoreData);

// Function to handle payments
export const fetchPayments = () => api.get('/payments');
export const createPayment = (paymentData) => api.post('/payments', paymentData);

export default api;