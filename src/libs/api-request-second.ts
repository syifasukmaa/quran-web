import axios from 'axios';
const BASE_URL_SECOND = import.meta.env.VITE_APP_API_SECOND;

const apiRequestSecond = axios.create({
  baseURL: BASE_URL_SECOND,
  headers: {
    'Accept-Language': 'id-ID',
  },
});

export default apiRequestSecond;
