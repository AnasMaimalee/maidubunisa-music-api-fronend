import axios from 'axios';

const BASE_URL = 'https://fatidic-elin-unelective.ngrok-free.dev/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
