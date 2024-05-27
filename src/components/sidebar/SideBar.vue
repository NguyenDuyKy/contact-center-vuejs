<template>
    <div class="sidebar" :style="{ width: sidebarWidth }">
        <div class="sidebar-header" :style="{ height: computedHeight + 'px' }">
            <div class="user-info" v-if="collapsed">
                <div class="avatar">
                    <span>{{ renderAvt }}</span>
                </div>
            </div>
            <div class="user-info" v-else>
                <div class="avatar">
                    <span>{{ renderAvt }}</span>
                </div>
                <router-link class="email" to="/user">{{ this.email }}</router-link>
                <p>{{ this.userName }}</p>
            </div>
        </div>
        <SideBarLink to="/" icon="bx bx-home">Home</SideBarLink>
        <SideBarLink to="/contact" icon="bx bxs-contact">Contact</SideBarLink>
        <SideBarLink to="/stringee-demo" icon="bx bxs-castle">Stringee</SideBarLink>
        <div class="logout-area" @click="logout">
            <i class="bx bx-log-out"></i>
            <p v-if="!collapsed">Logout</p>
        </div>
        <span class="collapse-icon" @click="toggleSidebar">
            <i :class="collapsed ? 'bx bx-chevrons-right' : 'bx bx-chevrons-left'"></i>
        </span>
    </div>
</template>

<script>
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import SideBarLink from "./SideBarLink.vue";
import { userApi } from "../../api/api.js";

export default {
    components: {
        SideBarLink
    },
    setup() {
        return {
            collapsed,
            toggleSidebar,
            sidebarWidth,
            userName: "",
            email: "",
            isAuthenticated: false
        }
    },
    created() {
        this.isAuthenticated = localStorage.getItem("isAuthenticated");
        if (this.isAuthenticated) {
            const userData = JSON.parse(localStorage.getItem("userData"));
            this.email = userData.email;
            this.userName = userData.name;
        }
    },
    computed: {
        renderAvt() {
            return this.userName.split(" ").map(word => word.charAt(0)).join("").toUpperCase();
        },
        computedHeight() {
            return this.collapsed ? 70 : 120;
        }
    },
    methods: {
        async logout() {
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const logoutResponse = await userApi.logout({ refreshToken });
                if (logoutResponse) {
                    localStorage.clear();
                    this.$router.push({ name: "LoginPage" });
                }
            } catch (err) {
                console.log(err);
                localStorage.clear();
                this.$router.push({ name: "LoginPage" });
            }
        }
    },
}
</script>

<style>
:root {
    --sidebar-bg-color: #2f855a;
    --sidebar-item-hover: #38a169;
    --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
    color: white;
    backdrop-filter: blur(30px);
    border-right: 2px solid rgba(255, 255, 255, .1);
    float: left;
    position: fixed;
    min-height: 100vh;
    top: 0;
    left: 0;
    bottom: 0;
    transition: .3s ease;
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.collapse-icon {
    position: absolute;
    bottom: 0;
    transition: 0.2s linear;
    color: rgba(255, 255, 255, .7);
    font-size: 40px;
    margin-left: 5px;
}

.sidebar-header {
    margin-top: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-info {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.user-info a {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: #fff;
}

.user-info p {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 20px;
}

.user-info a:hover {
    text-decoration: underline;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: wheat;
    font-size: 20px;
    color: black;
}

.logout-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    border-radius: 0.25em;
    padding: 10px;
    margin: 5px;
    font-size: 20px;
    cursor: pointer;
}

.logout-area:hover {
    background-color: var(--sidebar-item-hover);
}

.logout-area i {
    font-size: 30px;
    margin-right: 5px;
}
</style>