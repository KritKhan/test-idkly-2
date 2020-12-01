import axios from "axios";
import { getToken, removeToken } from "helpers/Auth";

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "",
  headers: {
    Authorization: getToken() || "",
  },
});

client.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      removeToken();
      window.location.assign("/signin");
      throw new axios.Cancel("401: Unauthorized");
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
