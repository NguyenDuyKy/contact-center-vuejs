import axiosClient from "@/utils/axios_client";

const userApi = {
    register: params => {
        const url = "/user/register";
        return axiosClient.post(url, params);
    },
    login: params => {
        const url = "/user/login";
        return axiosClient.post(url, params);
    },
    logout: params => {
        const url = "/user/logout";
        return axiosClient.post(url, params);
    },
    sendOTP: email => {
        const url = "/user/send-otp";
        return axiosClient.post(url, { email: email });
    },
    recoverPassword: params => {
        const url = "/user/recover-password";
        return axiosClient.post(url, params);
    }
}

export default userApi;