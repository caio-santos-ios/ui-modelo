import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
console.log("API Service initialized with base URL:", url);
export const uriBase = "http://localhost:5097";
export const baseURL = `${uriBase}/api`;

export const api = axios.create({
  baseURL
});
