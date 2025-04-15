// lib/publicApi.js
import axios from 'axios';

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default publicApi;