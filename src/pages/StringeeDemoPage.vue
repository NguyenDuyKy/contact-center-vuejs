<template>
    <div class="background">
        <LayoutComponent></LayoutComponent>
    </div>
</template>

<script>
import LayoutComponent from "../components/layout/LayoutComponent.vue";
export default {
    name: "StringeeDemoPage",
    components: {
        LayoutComponent
    },
    data() {
        return {
            isAuthenticated: false
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (!this.isAuthenticated) {
            this.$router.push({ name: "LoginPage" });
        }
    },
    methods: {

    },
};
</script>

<style></style>