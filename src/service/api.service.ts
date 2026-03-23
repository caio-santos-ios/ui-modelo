import axios from "axios";

export const uriBase = "http://localhost:5097";
export const baseURL = `${uriBase}/api`;

export const api = axios.create({
  baseURL
});
