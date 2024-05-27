import axiosClient from "@/utils/axios_client";

const contactApi = {
    createContact: params => {
        const url = "/contact/create";
        return axiosClient.post(url, params);
    },
    updateContact: (id, params) => {
        const url = "/contact/" + id;
        return axiosClient.put(url, params);
    },
    getContactByPhoneNumber: phoneNumber => {
        const url = "/contact?phone_number=" + phoneNumber;
        return axiosClient.get(url);
    },
    getContact: id => {
        const url = "/contact/" + id;
        return axiosClient.get(url);
    },
    getList: query => {
        query = !query ? "" : query;
        const url = "/contact" + query;
        return axiosClient.get(url);
    },
    deleteContact: id => {
        const url = "/contact/delete/" + id;
        return axiosClient.delete(url);
    }
}

export default contactApi;