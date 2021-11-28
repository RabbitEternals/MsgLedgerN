import axios from "axios";

export const createMessage = (body) => {
  return axios.post("/create", body, {
    baseURL: process.env.apiBaseURL
  });
}

export const loadMessages = (page) => {
  return axios.get("/list?page=" + page, {
    baseURL: process.env.apiBaseURL
  });
}
