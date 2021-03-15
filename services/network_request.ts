import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});
