<template>
    <div class="background">
        <LayoutComponent>
            <div class="user-info-page">
                <div class="user-info-area">

                </div>
                <div class="stringee-info-area">
                </div>
            </div>
        </LayoutComponent>
    </div>
</template>

<script>
import LayoutComponent from "../components/layout/LayoutComponent.vue";
export default {
    name: "UserPage",
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
};
</script>

<style>
.user-info-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    color: white;
}

.user-info-area {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid gray;
    padding: 10px;
}

.stringee-info-area {
    width: 50%;
    height: 100%;
    display: flex;
    border: 2px solid gray;
    padding: 10px;
}
</style>