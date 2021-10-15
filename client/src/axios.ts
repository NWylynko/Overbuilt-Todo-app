import Axios from "axios";

export const axiosIngress = Axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "authorization": ""
  },
})

export const axiosTasks = Axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    "authorization": ""
  },
})