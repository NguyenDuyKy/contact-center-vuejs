import axiosClient from "@/utils/axios_client";

const stringeeApi = {
    getPccClientOken: userId => {
        const url = "/stringee/agent/pcc-client-token/" + userId;
        return axiosClient.get(url);
    },
    getNumberList: () => {
        const url = "/stringee/number";
        return axiosClient.get(url);
    },
    updateAgent: (userId, params) => {
        const url = "/stringee/agent/update/" + userId;
        return axiosClient.post(url, params);
    },
    getAgent: userId => {
        const url = "/stringee/agent/" + userId;
        return axiosClient.get(url);
    }
}

export default stringeeApi;