<template>
    <div class="background">
        <LayoutComponent>
            <div class="contact-detail-page">
                <div class="contact-detail-wrapper">
                    <div class="contact-detail-header">
                        <i class="bx bx-arrow-back" @click="backToContactPage"></i>
                        <i class="bx bxs-edit" v-if="isViewMode" @click="enableEditMode"></i>
                        <i class="bx bxs-x-circle" v-if="!isCreateNewContact" @click="deleteContact"></i>
                        <i class="bx bxs-id-card" v-if="!isCreateNewContact"></i>
                        <p>{{ contactDetail._id }}</p>
                    </div>
                    <div class="contact-detail-body">
                        <p>Name</p>
                        <input type="text" maxlength="100" v-model="contactDetail.name" :disabled="isViewMode">
                    </div>
                    <div class="contact-detail-body">
                        <p>Gender</p>
                        <div class="gender-field">
                            <input type="radio" id="male" value="male" v-model="contactDetail.gender"
                                :disabled="isViewMode">
                            <label for="male">Male</label>
                            <input type="radio" id="female" value="female" v-model="contactDetail.gender"
                                :disabled="isViewMode">
                            <label for="female">Female</label>
                        </div>
                    </div>
                    <div class="contact-detail-body">
                        <p>Phone number</p>
                        <input type="text" v-model="contactDetail.phone_number" :disabled="isViewMode"
                            @keypress="validateInputPhone" maxlength="20">
                    </div>
                    <div class="contact-detail-body">
                        <p>Email</p>
                        <input type="text" v-model="contactDetail.email" :disabled="isViewMode" maxlength="100">
                    </div>
                    <div class="contact-detail-body">
                        <p>Address</p>
                        <input type="text" v-model="contactDetail.address" :disabled="isViewMode" maxlength="100">
                    </div>
                    <div class="contact-detail-body">
                        <p>Company</p>
                        <input type="text" v-model="contactDetail.company" :disabled="isViewMode" maxlength="100">
                    </div>
                    <div class="contact-detail-body">
                        <p>VIP</p>
                        <div class="checkbox-wrapper-10">
                            <input class="tgl tgl-flip" id="cb5" type="checkbox" v-model="contactDetail.vip"
                                :disabled="isViewMode" />
                            <label class="tgl-btn" data-tg-off="No" data-tg-on="Yes" for="cb5"></label>
                        </div>
                    </div>
                    <div class="contact-detail-button" v-if="!isViewMode">
                        <button class="create-update-btn" @click="performAction">{{ isCreateNewContact ? "Create" :
                            "Update"
                            }}</button>
                        <button class="cancel-btn" @click="enableViewMode">Cancel</button>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    </div>
</template>

<script>
import LayoutComponent from "../components/layout/LayoutComponent.vue";
import { contactApi } from "../api/api.js";
import { TOAST_CONFIG, SUCCESS_DESC } from "../utils/constant.js";
import { useToast } from "vue-toastification";
const blankContact = {
    _id: "",
    name: "",
    phone_number: "",
    email: "",
    address: "",
    company: "",
    gender: "male",
    vip: false
};
export default {
    name: "ContactDetailPage",
    components: {
        LayoutComponent
    },
    props: ["contactId"],
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            isAuthenticated: false,
            isViewMode: true,
            isCreateNewContact: false,
            contactResponse: {},
            contactDetail: {},
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!this.isAuthenticated) {
            this.$router.push({ name: "LoginPage" });
        }
    },
    async mounted() {
        try {
            if (this.contactId === "add-contact") {
                this.isViewMode = false;
                this.isCreateNewContact = true;
                this.contactDetail = { ...blankContact };
            } else {
                const contactRes = await contactApi.getContact(this.contactId);
                this.contactResponse = contactRes.contact;
                this.contactDetail = { ...this.contactResponse };
            }
        } catch (err) {
            if (err.status === 401 && err.message === "Unauthorized") {
                this.$router.push({ name: "LoginPage" });
                localStorage.clear();
            } else return this.toast.error(err.message, TOAST_CONFIG);
        }
    },
    methods: {
        backToContactPage() {
            this.$router.push({ name: "ContactPage" });
        },
        enableEditMode() {
            this.isViewMode = false;
        },
        enableViewMode() {
            if (!this.isCreateNewContact) {
                this.contactDetail = { ...this.contactResponse };
                this.isViewMode = true;
            } else {
                this.contactDetail = { ...blankContact };
                this.$router.push({ name: "ContactPage" });
            }
        },
        performAction() {
            if (this.isCreateNewContact) {
                this.createContact();
            } else {
                this.updateContact();
            }
        },
        async createContact() {
            try {
                const contactRes = await contactApi.createContact({
                    name: this.contactDetail.name,
                    phone_number: this.contactDetail.phone_number,
                    email: this.contactDetail.email,
                    gender: this.contactDetail.gender,
                    company: this.contactDetail.company,
                    vip: this.contactDetail.vip,
                    address: this.contactDetail.address
                });
                if (contactRes && contactRes.newContact) {
                    this.toast.success(SUCCESS_DESC.CREATE_CONTACT, TOAST_CONFIG);
                    this.contactResponse = contactRes.newContact;
                    this.contactDetail = { ...this.contactResponse };
                    this.isViewMode = true;
                    this.isCreateNewContact = false;
                }
            } catch (err) {
                if (err.status === 401 && err.message === "Unauthorized") {
                    this.$router.push({ name: "LoginPage" });
                    localStorage.clear();
                } else
                    this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        async updateContact() {
            try {
                const contactRes = await contactApi.updateContact(this.contactDetail._id, {
                    name: this.contactDetail.name,
                    phone_number: this.contactDetail.phone_number,
                    email: this.contactDetail.email,
                    gender: this.contactDetail.gender,
                    company: this.contactDetail.company,
                    vip: this.contactDetail.vip,
                    address: this.contactDetail.address
                });
                if (contactRes && contactRes.updatedContact) {
                    this.toast.success(SUCCESS_DESC.UPDATE_CONTACT, TOAST_CONFIG);
                    this.contactResponse = contactRes.updatedContact;
                    this.contactDetail = { ...this.contactResponse };
                    this.isViewMode = true;
                }
            } catch (err) {
                if (err.status === 401 && err.message === "Unauthorized") {
                    this.$router.push({ name: "LoginPage" });
                    localStorage.clear();
                } else
                    this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        async deleteContact() {
            try {
                const deletedContactResponse = await contactApi.deleteContact(this.contactDetail._id);
                if (deletedContactResponse && deletedContactResponse.deletedData) {
                    this.toast.success(SUCCESS_DESC.DELETE_CONTACT, TOAST_CONFIG);
                    this.$router.push({ name: "ContactPage" });
                }
            } catch (err) {
                if (err.status === 401 && err.message === "Unauthorized") {
                    this.$router.push({ name: "LoginPage" });
                    localStorage.clear();
                } else
                    this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        validateInputPhone(e) {
            const allowedCharacters = /[0-9]/;
            if (!allowedCharacters.test(e.key)) {
                e.preventDefault();
            }
        }
    }
}
</script>

<style>
.contact-detail-page {
    width: 100%;
    height: 100%;
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center
}

.contact-detail-wrapper {
    width: 500px;
    height: 500px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, .1);
    backdrop-filter: blur(30px);
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.contact-detail-header {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;
}

.contact-detail-header i {
    font-size: 40px;
    margin-right: 10px;
}

.contact-detail-body {
    width: 100%;
    height: 40px;
}

.contact-detail-body {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-bottom: 10px
}

.contact-detail-body p {
    width: 30%;
    font-size: 15px
}

.contact-detail-body input {
    height: 35px;
    width: 70%;
    font-size: 20px;
    padding-left: 5px;
    padding-right: 5px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, .1);
    border-radius: 5px;
    outline: none;
    color: white;
}

.contact-detail-body .gender-field {
    width: 70%;
    display: flex;
    flex-direction: row;
    align-items: center
}

.contact-detail-body .gender-field input {
    width: 10%;
    margin-right: 10px;
}

.contact-detail-body .gender-field label {
    margin-right: 30px;
}

.contact-detail-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 20px
}

.contact-detail-button button {
    font-size: 20px;
    width: 90px;
    height: 45px;
    border-radius: 7px;
    border: none;
}

.contact-detail-button .create-update-btn {
    margin-right: 10px;
    background: #2f855a;
    color: white
}

.contact-detail-button .create-update-btn:hover {
    background: #38a169;
}

.contact-detail-button .cancel-btn {
    color: grey;
    background: white;
}

.contact-detail-button .cancel-btn:hover {
    background: wheat;
}

.checkbox-wrapper-10 .tgl {
    display: none;
}

.checkbox-wrapper-10 .tgl,
.checkbox-wrapper-10 .tgl:after,
.checkbox-wrapper-10 .tgl:before,
.checkbox-wrapper-10 .tgl *,
.checkbox-wrapper-10 .tgl *:after,
.checkbox-wrapper-10 .tgl *:before,
.checkbox-wrapper-10 .tgl+.tgl-btn {
    box-sizing: border-box;
}

.checkbox-wrapper-10 .tgl::-moz-selection,
.checkbox-wrapper-10 .tgl:after::-moz-selection,
.checkbox-wrapper-10 .tgl:before::-moz-selection,
.checkbox-wrapper-10 .tgl *::-moz-selection,
.checkbox-wrapper-10 .tgl *:after::-moz-selection,
.checkbox-wrapper-10 .tgl *:before::-moz-selection,
.checkbox-wrapper-10 .tgl+.tgl-btn::-moz-selection,
.checkbox-wrapper-10 .tgl::selection,
.checkbox-wrapper-10 .tgl:after::selection,
.checkbox-wrapper-10 .tgl:before::selection,
.checkbox-wrapper-10 .tgl *::selection,
.checkbox-wrapper-10 .tgl *:after::selection,
.checkbox-wrapper-10 .tgl *:before::selection,
.checkbox-wrapper-10 .tgl+.tgl-btn::selection {
    background: none;
}

.checkbox-wrapper-10 .tgl+.tgl-btn {
    outline: 0;
    display: block;
    width: 4em;
    height: 2em;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.checkbox-wrapper-10 .tgl+.tgl-btn:after,
.checkbox-wrapper-10 .tgl+.tgl-btn:before {
    position: relative;
    display: block;
    content: "";
    width: 50%;
    height: 100%;
}

.checkbox-wrapper-10 .tgl+.tgl-btn:after {
    left: 0;
}

.checkbox-wrapper-10 .tgl+.tgl-btn:before {
    display: none;
}

.checkbox-wrapper-10 .tgl:checked+.tgl-btn:after {
    left: 50%;
}

.checkbox-wrapper-10 .tgl-flip+.tgl-btn {
    padding: 2px;
    transition: all 0.2s ease;
    font-family: sans-serif;
    perspective: 100px;
}

.checkbox-wrapper-10 .tgl-flip+.tgl-btn:after,
.checkbox-wrapper-10 .tgl-flip+.tgl-btn:before {
    display: inline-block;
    transition: all 0.4s ease;
    width: 100%;
    text-align: center;
    position: absolute;
    line-height: 2em;
    font-weight: bold;
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 4px;
}

.checkbox-wrapper-10 .tgl-flip+.tgl-btn:after {
    content: attr(data-tg-on);
    background: #02C66F;
    transform: rotateY(-180deg);
}

.checkbox-wrapper-10 .tgl-flip+.tgl-btn:before {
    background: #FF3A19;
    content: attr(data-tg-off);
}

.checkbox-wrapper-10 .tgl-flip+.tgl-btn:active:before {
    transform: rotateY(-20deg);
}

.checkbox-wrapper-10 .tgl-flip:checked+.tgl-btn:before {
    transform: rotateY(180deg);
}

.checkbox-wrapper-10 .tgl-flip:checked+.tgl-btn:after {
    transform: rotateY(0);
    left: 0;
    background: #7FC6A6;
}

.checkbox-wrapper-10 .tgl-flip:checked+.tgl-btn:active:after {
    transform: rotateY(20deg);
}
</style>