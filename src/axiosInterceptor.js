import axios from "axios";
import { toast } from "react-toastify";

// to build uncomment https links and comment localhost links

const socketLink = "http://localhost:3005";

const clientAxios = axios.create({
  baseURL: "http://localhost:3002/",

  headers: {
    "x-csrf-token": JSON.parse(localStorage.getItem("loggedInUser"))?.token,
  },
});
const imsAxios = axios.create({
  baseURL: "http://localhost:3001/",

  headers: {
    "x-csrf-token": JSON.parse(localStorage.getItem("loggedInUser"))?.token,
  },
});
imsAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("this is the error", error);
    toast.error("Something wrong happened, Please contact your administrator");
  }
);
clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("this is the error", error);
    toast.error("Something wrong happened, Please contact your administrator");
  }
);

export { clientAxios, imsAxios, socketLink };
