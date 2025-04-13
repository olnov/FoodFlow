// import {process} from "std-env";

export default defineNuxtRouteMiddleware((to, from) => {
    const token = import.meta.client ? localStorage.getItem('accessToken') : null;

    if (!token) {
        return navigateTo('/forbidden');
    }
});
