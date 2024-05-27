<template>
    <div class="authen-page">
        <div class="wrapper">
            <form class="form-box" @submit.prevent="login">
                <h1>LOGIN</h1>
                <div class="input-box">
                    <input type="email" placeholder="Email" v-model="inputEmail" autocomplete="email" required />
                    <i class="bx bx-envelope"></i>
                </div>
                <div class="input-box">
                    <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="inputPassword"
                        autocomplete="current-password" required />
                    <i :class="showPassword ? 'bx bx-show' : 'bx bx-hide'" @click="togglePasswordVisibility"></i>
                </div>
                <div class="forgot-password">
                    <router-link to="/recover-password">Forgot password</router-link>
                </div>
                <button type="submit">Login</button>
                <div class="login-signup-link">
                    <p>Don't have an account?<router-link to="/signup">Sign up</router-link></p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { userApi } from "../api/api.js";
import { TOAST_CONFIG } from "../utils/constant.js";
import { useToast } from "vue-toastification";
export default {
    name: "LoginPage",
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            inputEmail: "",
            inputPassword: "",
            isAuthenticated: false,
            showPassword: false
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (this.isAuthenticated) {
            this.$router.push({ name: "HomePage" });
        }
    },
    methods: {
        async login() {
            try {
                if (this.isValid()) {
                    const params = { email: this.inputEmail, password: this.inputPassword };
                    const loginResponse = await userApi.login(params);
                    if (loginResponse) {
                        const userData = JSON.stringify(loginResponse.user);
                        localStorage.setItem("isAuthenticated", true);
                        localStorage.setItem("accessToken", loginResponse.accessToken);
                        localStorage.setItem("refreshToken", loginResponse.refreshToken);
                        localStorage.setItem("userData", userData);
                        this.$router.push({ name: "HomePage" });
                    }
                }
            } catch (err) {
                this.toast.error(err.message, TOAST_CONFIG);
            }
        },
        isValid() {
            return this.inputEmail !== "" && this.inputPassword !== "";
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        }
    },
    watch: {
        inputPassword(newValue) {
            this.inputPassword = newValue.replace(/\s/g, "");
        }
    }
};
</script>

<style></style>