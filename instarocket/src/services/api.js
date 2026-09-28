/* Cliente HTTP do app apontando para a API configurada em src/config.js */
import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

export default api;
/* Fim de api.js */
