import { createRouter, createWebHistory } from "vue-router";
import {
    Login,
    Signup,
    RecoverPassword,
    Home,
    Contact,
    StringeeDemo,
    User,
    NotFound,
    StringeeIframe,
    ContactDetail
} from "./components/Pages";

const routes = [
    {
        name: "LoginPage",
        path: "/login",
        component: Login
    },
    {
        name: "SignupPage",
        path: "/signup",
        component: Signup
    },
    {
        name: "RecoverPasswordPage",
        path: "/recover-password",
        component: RecoverPassword
    },
    {
        name: "HomePage",
        path: "/",
        component: Home
    },
    {
        name: "ContactPage",
        path: "/contact",
        component: Contact
    },
    {
        name: "ContactDetailPage",
        path: "/contact/:contactId",
        component: ContactDetail,
        props: true
    },
    {
        name: "StringeeDemoPage",
        path: "/stringee-demo",
        component: StringeeDemo
    },
    {
        name: "UserPage",
        path: "/user",
        component: User
    },
    {
        name: "StringeeIframe",
        path: "/stringee-iframe",
        component: StringeeIframe
    },
    {
        name: "NotFoundPage",
        path: "/:pathMatch(.*)*",
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;