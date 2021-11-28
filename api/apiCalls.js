import axios from "axios";

export const createMessage = (body) => {
  console.log("XXX url  ", axios.defaults.baseURL)

  return axios.post("/create", body, {
    baseURL: process.env.apiBaseURL
  });
}

export const loadMessages = (page) => {
  console.log("XXX url  ", process.env.apiBaseURL)
  return axios.get("/list?page=" + page, {
    baseURL: process.env.apiBaseURL
  });
}
