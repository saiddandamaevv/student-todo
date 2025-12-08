import axios from "axios";

export default axios.create({
    baseURL: 'http://localhost:5173/api',
    timeout: 1000,
});