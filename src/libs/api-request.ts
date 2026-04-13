import axios from 'axios';
const BASE_URL = import.meta.env.VITE_APP_API;

const apiRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept-Language': 'id-ID',
  },
});

export default apiRequest;
