import axios from "axios";
import { BASE_URL } from "./endpoints";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5_000,
  headers: {
    "Content-Type": "application/json",
  },
});
