<template>
    <div class="background">
        <LayoutComponent>
            <div class="user-info-page userpage-row">
                <div class="user-info-area userpage-column">
                    <div class="userpage-row" style="align-items: center;">
                        <h3>USER INFO</h3>
                        <div class="userpage-method-btn">
                            <i class="bx bxs-edit" v-if="!isUpdateUser" @click="allowUpdateUser"
                                id="allowUpdateUser"></i>
                            <i class="bx bx-check" v-if="isUpdateUser" @click="updateUser" id="updateUser"></i>
                            <i class="bx bx-x" v-if="isUpdateUser" @click="cancelUpdateUser" id="cancelUpdateUser"></i>
                        </div>
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Email</p>
                        <input class="userpage-input" v-model="inputUserInfo.email" type="text"
                            :disabled="!isUpdateUser" maxlength="100" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Name</p>
                        <input class="userpage-input" v-model="inputUserInfo.name" type="text" :disabled="!isUpdateUser"
                            maxlength="100" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Phone number</p>
                        <input class="userpage-input" v-model="inputUserInfo.phone_number" type="text"
                            :disabled="!isUpdateUser" @keypress="validateInputPhone" maxlength="20" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Stringee userId</p>
                        <input class="userpage-input" v-model="inputUserInfo.stringee_userid" type="text"
                            :disabled="!isUpdateUser" maxlength="35" />
                    </div>
                    <!-- <div class="userpage-row">
                        <h3>CHANGE PASSWORD</h3>
                        <div class="userpage-method-btn">
                            <i class="bx bxs-edit" v-if="!isChangePassword" @click="allowChangePassword"></i>
                            <i class="bx bx-check" v-if="isChangePassword" @click="changePassword"></i>
                            <i class="bx bx-x" v-if="isChangePassword" @click="cancelChangePassword"></i>
                        </div>
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Old password</p>
                        <input class="userpage-input" type="text" :disabled="!isChangePassword" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>New password</p>
                        <input class="userpage-input" type="text" :disabled="!isChangePassword" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Confirm new password</p>
                        <input class="userpage-input" type="text" :disabled="!isChangePassword" />
                    </div> -->
                </div>
                <div class="stringee-info-area userpage-column" v-if="isLinkStringeeAgent">
                    <div class="userpage-row" style="align-items: center;">
                        <h3>AGENT INFO</h3>
                        <div class="userpage-method-btn">
                            <i class="bx bxs-edit" v-if="!isUpdateAgent" @click="allowUpdateAgent"
                                id="allowUpdateUser"></i>
                            <i class="bx bx-check" v-if="isUpdateAgent" @click="updateAgent" id="updateUser"></i>
                            <i class="bx bx-x" v-if="isUpdateAgent" @click="cancelUpdateAgent"
                                id="cancelUpdateUser"></i>
                        </div>
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Agent Name</p>
                        <input class="userpage-input" type="text" v-model="inputAgentInfo.name"
                            :disabled="!isUpdateAgent" maxlength="100" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Extension</p>
                        <input class="userpage-input" type="text" v-model="inputAgentInfo.sip_phone_extension"
                            :disabled="!isUpdateAgent" maxlength="100" />
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Manual status</p>
                        <div class="userpage-dropdown">
                            <button @click="toggleDropdown" class="manual-status-button" :disabled="!isUpdateAgent"><i
                                    :class="getStatusIcon(inputAgentInfo.manual_status)"></i>{{
                                        inputAgentInfo.manual_status }}</button>
                            <ul v-if="isDropdownOpen" class="manual-status-menu">
                                <li v-for="status in manualStatuses" :key="status.value" class="manual-status-item"
                                    @click="changeStatus(status)">
                                    <i :class="status.icon"></i>
                                    {{ status.label }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="userpage-info-item userpage-row">
                        <p>Phone number</p>
                        <input class="userpage-input" type="text" v-model="inputAgentInfo.phone_number"
                            :disabled="!isUpdateAgent" maxlength="100" @keypress="validateInputPhone" />
                    </div>
                </div>
            </div>
        </LayoutComponent>
    </div>
</template>

<script>
import userApi from "@/api/user_api";
import stringeeApi from "@/api/stringee_api";
import LayoutComponent from "../components/layout/LayoutComponent.vue";
import { TOAST_CONFIG, SUCCESS_DESC } from "../utils/constant.js";
import { useToast } from "vue-toastification";
export default {
    name: "UserPage",
    components: {
        LayoutComponent
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            isAuthenticated: false,
            isUpdateUser: false,
            isUpdateAgent: false,
            inputUserInfo: {},
            inputAgentInfo: {},
            isLinkStringeeAgent: false,
            isDropdownOpen: false,
            manualStatuses: [
                { value: "AVAILABLE", label: "AVAILABLE", icon: "bx bxs-sun" },
                { value: "LUNCH BREAK", label: "LUNCH BREAK", icon: "bx bxs-bowl-hot" },
                { value: "SHORT BREAK", label: "SHORT BREAK", icon: "bx bxs-coffee" },
                { value: "NOT AVAILABLE", label: "NOT AVAILABLE", icon: "bx bxs-moon" }
            ]
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!this.isAuthenticated) {
            this.$router.push({ name: "LoginPage" });
        } else {
            const userData = JSON.parse(localStorage.getItem("userData"));
            this.inputUserInfo = { ...userData };
        }
    },
    async mounted() {
        try {
            this.isLinkStringeeAgent = this.inputUserInfo.stringee_userid ? true : false;
            if (this.isLinkStringeeAgent) {
                await this.retrieveAgentInfo();
            }
        } catch (err) {
            this.toast.error(err.message, TOAST_CONFIG);
        }
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        changeStatus(status) {
            this.inputAgentInfo.manual_status = status.value;
            this.isDropdownOpen = false;
        },
        getStatusIcon(status) {
            switch (status) {
                case "AVAILABLE":
                    return "bx bxs-sun";
                case "LUNCH BREAK":
                    return "bx bxs-bowl-hot";
                case "SHORT BREAK":
                    return "bx bxs-coffee";
                case "NOT AVAILABLE":
                    return "bx bxs-moon";
            }
        },
        allowUpdateUser() {
            this.isUpdateUser = true;
        },
        allowUpdateAgent() {
            this.isUpdateAgent = true;
        },
        cancelUpdateUser() {
            const userData = JSON.parse(localStorage.getItem("userData"));
            this.inputUserInfo = { ...userData };
            this.isUpdateUser = false;
        },
        cancelUpdateAgent() {
            this.retrieveAgentInfo();
            this.isDropdownOpen = false;
            this.isUpdateAgent = false;
        },
        async updateUser() {
            try {
                const userId = this.inputUserInfo.id;
                const params = {
                    email: this.inputUserInfo.email,
                    name: this.inputUserInfo.name,
                    phone_number: this.inputUserInfo.phone_number,
                    stringee_userid: this.inputUserInfo.stringee_userid
                }
                const updateResponse = await userApi.updateUserInfo(userId, params);
                if (updateResponse && updateResponse.user) {
                    this.isUpdateUser = false;
                    this.inputUserInfo = { ...updateResponse.user };
                    if (window.StringeeSoftPhone.connected && updateResponse.user.stringee_userid) {
                        await window.StringeeSoftPhone.disconnect();
                        const stringeeToken = await stringeeApi.getPccClientOken(updateResponse.user.stringee_userid);
                        await window.StringeeSoftPhone.connect(stringeeToken);
                        this.isLinkStringeeAgent = true;
                    } else if (!window.StringeeSoftPhone.connected && updateResponse.user.stringee_userid) {
                        const stringeeToken = await stringeeApi.getPccClientOken(updateResponse.user.stringee_userid);
                        await window.StringeeSoftPhone.connect(stringeeToken);
                        this.isLinkStringeeAgent = true;
                    } else {
                        await window.StringeeSoftPhone.disconnect();
                        this.isLinkStringeeAgent = false;
                    }
                    localStorage.setItem("userData", JSON.stringify(updateResponse.user));
                }
                this.toast.success(SUCCESS_DESC.UPDATE_USER, TOAST_CONFIG);
            } catch (err) {
                this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        async updateAgent() {
            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                const agentId = userData.stringee_userid;
                const params = {
                    name: this.inputAgentInfo.name,
                    sip_phone_extension: this.inputAgentInfo.sip_phone_extension,
                    manual_status: this.inputAgentInfo.manual_status,
                    phone_number: this.inputAgentInfo.phone_number
                }
                const updateResponse = await stringeeApi.updateAgent(agentId, params);
                if (updateResponse) {
                    this.isUpdateAgent = false;
                    this.toast.success(SUCCESS_DESC.UPDATE_AGENT, TOAST_CONFIG);
                }
            } catch (err) {
                this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        validateInputPhone(e) {
            const allowedCharacters = /[0-9]/;
            if (!allowedCharacters.test(e.key)) {
                e.preventDefault();
            }
        },
        async retrieveAgentInfo() {
            const agentInfo = await stringeeApi.getAgent(this.inputUserInfo.stringee_userid);
            this.inputAgentInfo = { ...agentInfo.data };
        }
    }
};
</script>

<style scoped>
.userpage-row {
    display: flex;
    flex-direction: row;
}

.userpage-column {
    display: flex;
    flex-direction: column;
}

.user-info-page {
    width: 100%;
    height: 100%;
    color: white;
}

.user-info-area {
    width: 50%;
    height: 100%;
    padding: 10px;
}

.stringee-info-area {
    width: 50%;
    height: 100%;
    padding: 10px;
}

.userpage-method-btn {
    font-size: 30px;
    margin-left: 10px;
}

.userpage-method-btn i {
    cursor: pointer;
}

.userpage-info-item {
    justify-content: space-between;
    align-items: center;
    width: 95%;
    height: 50px;
    margin-left: 10px;
}

.userpage-input {
    width: 60%;
    height: 80%;
    font-size: 20px;
    border-radius: 10px;
    color: white;
    background: transparent;
    backdrop-filter: blur(30px);
    padding-left: 10px;
    padding-right: 10px;
}

#allowUpdateUser:hover {
    color: aqua;
}

#updateUser:hover {
    color: rgb(13, 191, 13);
}

#cancelUpdateUser:hover {
    color: red;
}

.manual-status-button {
    cursor: pointer;
    font-size: 20px;
    width: 60%;
    height: 100%;
    border-radius: 10px;
    color: white;
    background: transparent;
    backdrop-filter: blur(30px);
    align-items: center;
}

.manual-status-button i {
    margin-right: 10px;
}

.manual-status-menu {
    position: absolute;
    top: 100%;
    width: 60%;
    right: 0;
    background-color: transparent;
    backdrop-filter: blur(30px);
    border-radius: 5px;
    z-index: 10;
}

.manual-status-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    font-size: 20px;
}

.manual-status-item i {
    margin-right: 10px;
}

.manual-status-item:hover {
    background-color: #35573a;
}

.userpage-dropdown {
    position: relative;
    display: flex;
    width: 60%;
    height: 100%;
    justify-content: end;
}
</style>