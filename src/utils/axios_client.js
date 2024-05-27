import axios from "axios";
import { jwtDecode } from "jwt-decode";

var accessToken = "";

const axiosClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use(
    async config => {
        accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const jwtPayload = jwtDecode(accessToken);
            const currentTimeStamp = Math.floor(Date.now() / 1000);
            if (jwtPayload.exp <= currentTimeStamp) {
                console.log("Token is expired, request new token...");
                const refreshToken = localStorage.getItem("refreshToken");
                const responseRefreshToken = await axios.post(`${process.env.VUE_APP_API_URL}/user/refresh-token`, { refreshToken: refreshToken });
                localStorage.setItem("accessToken", responseRefreshToken.data.accessToken);
                config.headers["ndk-auth"] = responseRefreshToken.data.accessToken;
                return config;
            } else {
                config.headers["ndk-auth"] = accessToken;
                return config;
            }
        }
        return config;
    },
    async error => {
        throw error;
    }
);

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

axiosClient.interceptors.response.use(
    response => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    error => {
        if (error && error.response && error.response.data && error.response.data.error) throw error.response.data.error;
        throw error;
    }
);

export default axiosClient;

