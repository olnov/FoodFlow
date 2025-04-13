import type { NitroFetchOptions } from "nitropack/types";

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
}

export const useAuth = () => {
    const config = useRuntimeConfig()
    const BACKEND_URL = config.public.BACKEND_URL

    const login = async (email: string, password: string) => {
        const requestOptions: NitroFetchOptions<any> = {
            method: 'POST',
            body: {
                email: email,
                password: password,
            },
        };

        try {
            const response: LoginResponse = await $fetch(`${BACKEND_URL}/auth/api/v1/login`, requestOptions);
            // Store access token in localStorage or cookie
            localStorage.setItem('accessToken', response.accessToken);

            // Store refresh token in a cookie for 7 days
            const refreshToken = useCookie('refresh_token', {
                maxAge: 60 * 60 * 24 * 7,
                secure: true,
                sameSite: 'strict',
            });
            refreshToken.value = response.refreshToken;
            return response;
        } catch {
            throw createError({
            message: 'Login failed',
            });
        }
    }

    return { login };
}