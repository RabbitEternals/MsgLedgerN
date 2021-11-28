import axios from "axios";

export const createMessage = (body) => {
  return axios.post("/create", body, {
    headers: {
      'Content-Type':'application/json;charset=utf-8',
    },
    baseURL: process.env.apiBaseURL
  });
}

export const loadMessages = (page) => {
  return axios.get("/list?page=" + page, {
    headers: {
      Accept:'application/json;charset=utf-8',
    },
    baseURL: process.env.apiBaseURL
  });
}
