<template>
    <router-link :to="to" class="sidebar-link" :class="{ active: isActive }">
        <i class="sidebar-icon" :class="icon"></i>
        <transition>
            <span v-if="!collapsed">
                <slot />
            </span>
        </transition>
    </router-link>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { collapsed } from "./state";

export default {
    props: {
        to: { type: String, required: true },
        icon: { type: String, required: true }
    },
    setup(props) {
        const route = useRoute();
        const isActive = computed(() => route.path === props.to);
        return { isActive, collapsed };
    }
}
</script>

<style scoped>
.sidebar-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    font-weight: 400;
    user-select: none;
    margin: 5px;
    padding: 10px;
    border-radius: 0.25em;
    height: 1.5em;
    color: white;
    text-decoration: none;
    font-size: 20px;
}

.sidebar-link:hover {
    background-color: var(--sidebar-item-hover);
}

.sidebar-link.active {
    background-color: var(--sidebar-item-active);
}

.sidebar-link .sidebar-icon {
    flex-shrink: 0;
    width: 25px;
    margin-right: 10px;
    font-size: 30px;
}
</style>