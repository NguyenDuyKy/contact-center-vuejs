<template>
    <div class="background">
        <div class="stringee-iframe">
            <div class="iframe-wrapper">
                <div class="header-field">
                    <i class="bx bx-arrow-back" @click="backToHomePage"></i>
                    <div class="contactid-field">
                        <i class="bx bxs-id-card"></i>
                        <p>{{ contact._id }}</p>
                    </div>
                    <i :class="isExistedContact ? 'bx bxs-edit' : 'bx bx-plus-circle'" v-if="isViewMode"
                        @click="enableEditMode"></i>
                </div>
                <div class="body-field">
                    <p>Name</p>
                    <input type="text" maxlength="100" v-model="contact.name" :disabled="isViewMode">
                </div>
                <div class="body-field">
                    <p>Gender</p>
                    <div class="gender-field">
                        <input type="radio" id="male" value="male" v-model="contact.gender" :disabled="isViewMode">
                        <label for="male">Male</label>
                        <input type="radio" id="female" value="female" v-model="contact.gender" :disabled="isViewMode">
                        <label for="female">Female</label>
                    </div>
                </div>
                <div class="body-field">
                    <p>Phone number</p>
                    <input type="text" v-model="contact.phone_number" :disabled="isViewMode"
                        @keypress="validateInputPhone" maxlength="20">
                </div>
                <div class="body-field">
                    <p>Email</p>
                    <input type="text" v-model="contact.email" :disabled="isViewMode" maxlength="100">
                </div>
                <div class="body-field">
                    <p>Address</p>
                    <input type="text" v-model="contact.address" :disabled="isViewMode" maxlength="100">
                </div>
                <div class="body-field">
                    <p>Company</p>
                    <input type="text" v-model="contact.company" :disabled="isViewMode" maxlength="100">
                </div>
                <div class="body-field">
                    <p>VIP</p>
                    <div class="checkbox-wrapper-10">
                        <input class="tgl tgl-flip" id="cb5" type="checkbox" v-model="contact.vip"
                            :disabled="isViewMode" />
                        <label class="tgl-btn" data-tg-off="No" data-tg-on="Yes" for="cb5"></label>
                    </div>
                </div>
                <div class="button-field" v-if="!isViewMode">
                    <button class="create-update-btn" @click="performAction">{{ isExistedContact ? " Update" : "Create"
                        }}</button>
                    <button class="cancel-btn" @click="enableViewMode">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
    name: "StringeeIframe",
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            isAuthenticated: false,
            isExistedContact: false,
            contactResponse: {},
            contact: {},
            isViewMode: true,
            contactPhone: ""
        }
    },
    async created() {
        try {
            this.isAuthenticated = localStorage.getItem("isAuthenticated");
            if (!this.isAuthenticated) {
                this.$router.push({ name: "LoginPage" });
            } else {
                const queryParams = this.$route.query;
                switch (queryParams?.call_type) {
                    case "1":
                        this.contactPhone = queryParams?.to_number;
                        break;
                    case "2":
                        this.contactPhone = queryParams?.from_number;
                        break;
                    default:
                        break;
                }
                switch (queryParams?.callDirection) {
                    case "outbound":
                        this.contactPhone = queryParams?.calleeNumber.replace(/^0/, "84");
                        break;
                    case "inbound":
                        this.contactPhone = queryParams?.callerNumber.replace(/^0/, "84");
                        break;
                    default:
                        break;
                }
                if (queryParams?.customerNumber) this.contactPhone = queryParams?.customerNumber.replace(/^0/, "84");
            }
        } catch (err) {
            console.log(err);
            this.$router.push({ name: "LoginPage" });
        }
    },
    async mounted() {
        try {
            const contactRes = await contactApi.getContactByPhoneNumber(this.contactPhone);
            if (contactRes && contactRes?.contactList[0]) {
                this.contactResponse = contactRes?.contactList[0]
                this.contact = { ...this.contactResponse };
                this.isExistedContact = true;
            } else {
                this.isExistedContact = false;
                this.contact = { ...blankContact };
                this.contact.phone_number = this.contactPhone;
            }
        } catch (err) {
            if (err.status === 401 && err.message === "Unauthorized") {
                this.$router.push({ name: "LoginPage" });
                localStorage.clear();
            } else return this.toast.error(err.message, TOAST_CONFIG);
        }
    },
    methods: {
        backToHomePage() {
            this.$router.push({ name: "HomePage" });
        },
        enableEditMode() {
            this.isViewMode = false;
        },
        enableViewMode() {
            if (this.isExistedContact) {
                this.contact = { ...this.contactResponse };
            } else {
                this.contact = { ...blankContact };
            }
            this.isViewMode = true;
        },
        async updateContact() {
            try {
                const contactRes = await contactApi.updateContact(this.contact._id, {
                    name: this.contact.name,
                    phone_number: this.contact.phone_number,
                    email: this.contact.email,
                    gender: this.contact.gender,
                    company: this.contact.company,
                    vip: this.contact.vip,
                    address: this.contact.address
                });
                if (contactRes && contactRes.updatedContact) {
                    this.toast.success(SUCCESS_DESC.UPDATE_CONTACT, TOAST_CONFIG);
                    this.contactResponse = contactRes.updatedContact;
                    this.contact = { ...this.contactResponse };
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
        async createContact() {
            try {
                const contactRes = await contactApi.createContact({
                    name: this.contact.name,
                    phone_number: this.contact.phone_number,
                    email: this.contact.email,
                    gender: this.contact.gender,
                    company: this.contact.company,
                    vip: this.contact.vip,
                    address: this.contact.address
                });
                if (contactRes && contactRes.newContact) {
                    this.toast.success(SUCCESS_DESC.CREATE_CONTACT, TOAST_CONFIG);
                    this.contactResponse = contactRes.newContact;
                    this.contact = { ...this.contactResponse };
                    this.isViewMode = true;
                    this.isExistedContact = true;
                }
            } catch (err) {
                if (err.status === 401 && err.message === "Unauthorized") {
                    this.$router.push({ name: "LoginPage" });
                    localStorage.clear();
                } else
                    this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        performAction() {
            if (this.isExistedContact) {
                this.updateContact();
            } else {
                this.createContact();
            }
        },
        validateInputPhone(e) {
            const allowedCharacters = /[0-9]/;
            if (!allowedCharacters.test(e.key)) {
                e.preventDefault();
            }
        }
    }
};
</script>

<style>
.stringee-iframe {
    min-width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.iframe-wrapper {
    width: 500px;
    height: 500px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, .1);
    backdrop-filter: blur(30px);
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    color: white;
    padding: 10px;
}

.iframe-wrapper .header-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
}

.header-field .contactid-field {
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.header-field i {
    font-size: 30px;
    cursor: pointer;
}

.contactid-field i {
    font-size: 40px;
    margin-right: 5px;
}

.iframe-wrapper .body-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-bottom: 20px
}

.body-field p {
    width: 30%;
    font-size: 15px
}

.body-field input {
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

.body-field .gender-field {
    width: 70%;
    display: flex;
    flex-direction: row;
    align-items: center
}

.body-field .gender-field input {
    width: 10%;
    margin-right: 10px;
}

.body-field .gender-field label {
    margin-right: 30px;
}

.iframe-wrapper .button-field {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 20px
}

.button-field button {
    font-size: 20px;
    width: 90px;
    height: 45px;
    border-radius: 7px;
    border: none;
}

.create-update-btn {
    margin-right: 10px;
    background: #2f855a;
    color: white
}

.create-update-btn:hover {
    background: #38a169;
}

.cancel-btn {
    color: grey;
    background: white;
}

.cancel-btn:hover {
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