import axios from "axios";

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
