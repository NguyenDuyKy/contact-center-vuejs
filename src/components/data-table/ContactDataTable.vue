<template>
    <div class="data-table">
        <table>
            <tr class="table-title">
                <th v-for="title in titles" :key="title">{{ title }}</th>
            </tr>
            <tr v-for="item in filterData" :key="item._id">
                <td class="table-name-link">
                    <router-link :to="{ name: 'ContactDetailPage', params: { contactId: item._id } }">{{ item.name
                        }}</router-link>
                </td>
                <td>{{ item.email }}</td>
                <td>{{ item.phone_number }}</td>
                <td class="table-gender">
                    <i
                        :class="item.gender === 'male' ? 'bx bx-male-sign table-gender-male' : 'bx bx-female-sign table-gender-female'"></i>
                </td>
                <td class="table-vip">
                    <i :class="item.vip ? 'bx bx-check' : 'bx bx-x'"></i>
                </td>
                <td>
                    <div class="table-action">
                        <button class="delete-contact-button" @click="deleteContact(item._id)">
                            <i class="bx bxs-x-circle"></i>
                        </button>
                        <button class="view-contact-button" @click="viewContact(item._id)">
                            <i class="bx bx-show"></i>
                        </button>
                        <button class="click-to-call-button" @click="clickToCall(item.phone_number)">
                            <i class="bx bxs-phone"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import contactApi from '@/api/contact_api';
import { TOAST_CONFIG, SUCCESS_DESC, ERROR_DESC } from "../../utils/constant.js";
import { useToast } from "vue-toastification";
export default {
    props: {
        titles: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        }
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            deletedIds: [],
            StringeeSoftPhone: null
        }
    },
    computed: {
        filterData() {
            return this.data.filter(item => !this.deletedIds.includes(item._id));
        }
    },
    methods: {
        async deleteContact(id) {
            try {
                const deletedContactResponse = await contactApi.deleteContact(id);
                this.toast.success(SUCCESS_DESC.DELETE_CONTACT, TOAST_CONFIG);
                this.deletedIds.push(deletedContactResponse.deletedData._id);
            } catch (err) {
                if (err.status === 401 && err.message === "Unauthorized") {
                    this.$router.push({ name: "LoginPage" });
                    localStorage.clear();
                } else return this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        viewContact(id) {
            this.$router.push({ name: "ContactDetailPage", params: { contactId: id } });
        },
        clickToCall(toNumber) {
            if (window.StringeeSoftPhone) {
                const fromNumber = JSON.parse(localStorage.getItem("stringee_number_select"));
                if (!fromNumber) return this.toast.warning(ERROR_DESC.SELECT_NUMBER, TOAST_CONFIG);
                this.StringeeSoftPhone = window.StringeeSoftPhone;
                this.StringeeSoftPhone.config({ showMode: "full" });
                this.StringeeSoftPhone.makeCall(fromNumber.number, toNumber, function (res) {
                    console.log("Make call result", res);
                });
            } else this.toast.success(ERROR_DESC.NOT_FOUND_STRINGEE_SOFTPHONE, TOAST_CONFIG);
        }
    }
}
</script>

<style>
.data-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: white;
}

.data-table tr:nth-child(even) {
    background: rgba(19, 219, 9, 0.207);
}

.table-title {
    font-size: 20px;
    background: rgba(228, 29, 19, 0.207);
}

.data-table table {
    border-collapse: collapse;
    width: 100%;
}

.data-table table td,
th {
    border: 1px solid rgba(255, 255, 255, .1);
    text-align: left;
    padding: 5px;
}

.data-table button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
}

.data-table .table-action {
    display: flex;
}

.data-table .view-contact-button {
    background: rgb(0, 204, 255);
    border-radius: 10px;
    margin-right: 10px;
}

.data-table .delete-contact-button {
    background: red;
    border-radius: 10px;
    margin-right: 10px;
}

.data-table .click-to-call-button {
    background: rgb(47, 255, 64);
    border-radius: 10px;
    margin-right: 10px;
}

.data-table .table-gender,
.data-table .table-vip {
    font-size: 25px;
}

.table-gender-male {
    color: rgb(0, 255, 255);
}

.table-gender-female {
    color: rgba(233, 68, 106, 0.975);
}

.data-table .table-name-link a {
    text-decoration: none;
    color: white;
}

.data-table .table-name-link a:hover {
    text-decoration: underline;
}
</style>