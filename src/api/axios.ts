import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // tu backend Nest
  withCredentials: true, // si manejas cookies JWT
});




export default api;
