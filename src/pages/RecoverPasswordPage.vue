<template>
    <div class="authen-page">
        <div class="wrapper recover-password-page">
            <form class="form-box" @submit.prevent="recoverPassword">
                <h1>RECOVER PASSWORD</h1>
                <div class="input-box">
                    <input type="email" placeholder="Email" v-model="inputEmail" autocomplete="email" required />
                    <i class="bx bx-envelope"></i>
                </div>
                <div class="input-box">
                    <input :type="showPassword ? 'text' : 'password'" placeholder="New password"
                        v-model="inputNewPassword" autocomplete="current-password" required />
                    <i :class="showPassword ? 'bx bx-show' : 'bx bx-hide'" @click="togglePasswordVisibility"></i>
                </div>
                <div class="otp-area">
                    <div class="input-box otp-box">
                        <input type="text" placeholder="OTP" v-model="inputOTP" maxlength="5" required />
                    </div>
                    <div class="send-otp-btn" @click="sendOTP" v-if="!showResendOTP">Send OTP</div>
                    <div class="counter-otp" v-if="showResendOTP">
                        <p>Resend OTP in {{ timer }}s</p>
                    </div>
                </div>
                <button type="submit">Recover password</button>
                <div class="login-signup-link">
                    <p>Already have an account?<router-link to="/login">Login</router-link></p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { userApi } from "../api/api.js";
import { TOAST_CONFIG, ERROR_DESC, SUCCESS_DESC } from "../utils/constant.js";
import { useToast } from "vue-toastification";
export default {
    name: "RecoverPasswordPage",
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            isAuthenticated: false,
            showPassword: false,
            inputNewPassword: "",
            inputEmail: "",
            inputOTP: "",
            showResendOTP: false,
            timer: 45,
            countdownInterval: null
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (this.isAuthenticated) {
            this.$router.push({ name: "HomePage" });
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        async sendOTP() {
            try {
                if (this.inputEmail === "") return this.toast.warning(ERROR_DESC.MISSING_EMAIL, TOAST_CONFIG);
                this.showResendOTP = true;
                this.timer = 45;
                if (this.countdownInterval) {
                    clearInterval(this.countdownInterval);
                }
                this.countdownInterval = setInterval(() => {
                    if (this.timer > 0) {
                        this.timer--;
                    } else {
                        this.showResendOTP = false;
                        clearInterval(this.countdownInterval);
                    }
                }, 1000);
                const response = await userApi.sendOTP(this.inputEmail);
                if (response) {
                    this.toast.success(SUCCESS_DESC.SEND_OTP, TOAST_CONFIG);
                }
            } catch (err) {
                clearInterval(this.countdownInterval);
                this.showResendOTP = false;
                this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        async recoverPassword() {
            try {
                const params = {
                    email: this.inputEmail,
                    newPassword: this.inputNewPassword,
                    otp: this.inputOTP
                };
                const response = await userApi.recoverPassword(params);
                if (response) {
                    this.toast.success(SUCCESS_DESC.RECOVER_PASSWORD, TOAST_CONFIG);
                    this.$router.push({ name: "LoginPage" });
                }
            } catch (err) {
                this.toast.error(err.message, TOAST_CONFIG);
            }
        }
    },
    beforeUnmount() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    },
    watch: {
        inputNewPassword(newValue) {
            this.inputNewPassword = newValue.replace(/\s/g, "");
        },
        inputOTP(newValue) {
            this.inputOTP = newValue.replace(/[^0-9]/g, "");
        }
    }
};
</script>

<style></style>