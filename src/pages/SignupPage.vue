<template>
    <div class="authen-page">
        <div class="wrapper signup-page" @submit.prevent="signup">
            <form class="form-box">
                <h1>SIGN UP</h1>
                <div class="input-box">
                    <input type="text" placeholder="User name" v-model="inputUserName" required />
                    <i class="bx bx-user"></i>
                </div>
                <div class="input-box">
                    <input type="email" placeholder="Email" autocomplete="email" v-model="inputEmail" required />
                    <i class="bx bx-envelope"></i>
                </div>
                <div class="input-box">
                    <input type="text" placeholder="Phone number" autocomplete="phone" v-model="inputPhoneNumber"
                        required />
                    <i class="bx bx-phone"></i>
                </div>
                <div class="input-box">
                    <input :type="showPassword ? 'text' : 'password'" v-model="inputPassword" placeholder="Password"
                        autocomplete="current-password" required />
                    <i :class="showPassword ? 'bx bx-show' : 'bx bx-hide'" @click="togglePasswordVisibility"></i>
                </div>
                <div class="input-box">
                    <input :type="showConfirmPassword ? 'text' : 'password'" v-model="inputConfirmPassword"
                        placeholder="Confirm password" autocomplete="current-password" required />
                    <i :class="showConfirmPassword ? 'bx bx-show' : 'bx bx-hide'"
                        @click="toggleConfirmPasswordVisibility"></i>
                </div>
                <div class="agree-condition">
                    <label><input type="checkbox" v-model="isAgree" /> I agree to the terms & conditions</label>
                </div>
                <button type="submit" v-if="isAgree">Sign up</button>
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
    name: "LoginPage",
    setup() {
        const toast = useToast();
        return { toast };
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (this.isAuthenticated) {
            this.$router.push({ name: "HomePage" });
        }
    },
    data() {
        return {
            inputUserName: "",
            inputEmail: "",
            inputPhoneNumber: "",
            inputPassword: "",
            inputConfirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
            isHide: true,
            isAgree: false
        }
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        toggleConfirmPasswordVisibility() {
            this.showConfirmPassword = !this.showConfirmPassword;
        },
        async signup() {
            try {
                if (this.isValid()) {
                    const params = {
                        name: this.inputUserName,
                        email: this.inputEmail,
                        phone_number: this.inputPhoneNumber,
                        password: this.inputPassword
                    }
                    const signupResponse = await userApi.register(params);
                    if (signupResponse) {
                        this.toast.success(SUCCESS_DESC.SIGN_UP, TOAST_CONFIG);
                        this.$router.push({ name: "LoginPage" });
                    }
                }
            } catch (err) {
                this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        isValid() {
            if (!this.inputUserName && !this.inputEmail && !this.inputPassword && !this.inputConfirmPassword && !this.isAgree) return false;
            if (this.inputPassword !== this.inputConfirmPassword) {
                this.toast.error(ERROR_DESC.MISS_MATCH_PASSWORD, TOAST_CONFIG);
                return false;
            }
            return true;
        }
    },
    watch: {
        inputPhoneNumber(newValue) {
            this.inputPhoneNumber = newValue.replace(/\D/g, "");
        },
        inputPassword(newValue) {
            this.inputPassword = newValue.replace(/\s/g, "");
        },
        inputConfirmPassword(newValue) {
            this.inputConfirmPassword = newValue.replace(/\s/g, "");
        }
    }
};
</script>

<style></style>