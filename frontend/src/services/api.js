import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register: d => api.post('/auth/register', d),
  login:    d => api.post('/auth/login', d),
  me:       () => api.get('/auth/me'),
};

export const usersAPI = {
  getUser:        id   => api.get(`/users/${id}`),
  updateProfile:  data => api.put('/users/profile', data),
  getConnections: ()   => api.get('/users/connections'),
  search:         q    => api.get(`/users/search?q=${q}`),
  leaderboard:    ()   => api.get('/users/leaderboard'),
};

export const matchesAPI = {
  getMatches: params => api.get('/matches', { params }),
  connect:    id     => api.post(`/matches/connect/${id}`),
  disconnect: id     => api.delete(`/matches/connect/${id}`),
};

export const chatAPI = {
  getConversations: ()             => api.get('/chat/conversations'),
  getHistory:       userId         => api.get(`/chat/${userId}`),
  sendMessage:      (userId, text) => api.post(`/chat/${userId}`, { text }),
  markRead:         userId         => api.patch(`/chat/${userId}/read`),
};

export const reviewsAPI = {
  create:     (userId, data) => api.post(`/reviews/${userId}`, data),
  getReviews: userId         => api.get(`/reviews/${userId}`),
};
export const swapAPI = {
  sendRequest:    (userId, data) => api.post(`/swap/request/${userId}`, data),
  getReceived:    ()             => api.get('/swap/received'),
  getSent:        ()             => api.get('/swap/sent'),
  acceptRequest:  id             => api.put(`/swap/accept/${id}`),
  declineRequest: id             => api.put(`/swap/decline/${id}`),
  getStatus:      userId         => api.get(`/swap/status/${userId}`),
};