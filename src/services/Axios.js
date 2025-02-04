import axios from "axios";

export const Axios = axios.create({
    baseURL: 'https://api.unsplash.com',
    timeout: 1000,
    headers: {"Authorization": `Client-ID ${import.meta.env.VITE_APP_UP_ACCESS_KEY}`}
  });