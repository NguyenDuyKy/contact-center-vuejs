<template>
    <SideBar v-if="!isLoginOrSignupPage" />
    <router-view>
    </router-view>
</template>

<script>
import "boxicons/css/boxicons.min.css";
import SideBar from "./components/sidebar/SideBar";
export default {
    name: "App",
    components: {
        SideBar
    },
    computed: {
        isLoginOrSignupPage() {
            return this.$route.name === "LoginPage" || this.$route.name === "SignupPage" || this.$route.name === "RecoverPasswordPage" || this.$route.name === "NotFoundPage" || this.$route.name === "StringeeIframe";
        }
    }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
@import url("./css/page.css");
@import url("./css/authen_page.css");

* {
    padding: 0;
    margin: 0;
}

body {
    font-family: "Poppins";
}
</style>