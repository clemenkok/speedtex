// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Base URL for your Go backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
