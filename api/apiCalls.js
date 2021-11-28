import axios from "axios";

export const createMessage = (body) => {
    return axios.post("/create", body);
}

export const loadMessages = (page) => {
  return axios.get("/list?page=" + page);
}
