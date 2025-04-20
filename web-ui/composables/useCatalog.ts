import type { NitroFetchOptions } from "nitropack/types";
import type { CatalogItem } from "~/types/catalog";

export const useCatalog = ()=>{
    const config = useRuntimeConfig();
    const BACKEND_URL = config.public.BACKEND_URL;

    const addCatalogItem = async (item: Partial<CatalogItem>) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }
        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: item,
            }

            return await $fetch(`${BACKEND_URL}/catalog/api/v1/catalog`, requestOptions)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Can\'t create catalog item',
                });
            } else {
                console.error('Unknown error: ',error);
            }
        }
    }

    const getCatalogItems = async (query: string = '' ): Promise<CatalogItem[]> => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }

        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: query ? { search: query } : {},
            }

            return await $fetch(`${BACKEND_URL}/catalog/api/v1/catalog`, requestOptions);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Can\'t get catalog items',
                })
            } else {
                console.error('Unknown error: ',error);
                throw createError({
                    message: 'Unknown error while retrieving catalog items',
                })
            }
        }
    }

    const getCatalogItem = async (id: string) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }

        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            return await $fetch(`${BACKEND_URL}/catalog/api/v1/catalog/${id}`, requestOptions);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Can\'t get a catalog item',
                })
            } else {
                console.error('Unknown error: ',error);
            }
        }
    }

    const editCatalogItem = async (id: string, item: Partial<CatalogItem>) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }

        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: item,
            }
            return await $fetch(`${BACKEND_URL}/catalog/api/v1/catalog/${id}`, requestOptions)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Can\'t update catalog item',
                });
            } else {
                console.error('Unknown error: ',error);
            }
        }
    }

    const deleteCatalogItem = async (id: string) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }
        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            await $fetch(`${BACKEND_URL}/catalog/api/v1/catalog/${id}`, requestOptions);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Failed to delete item',
                });
            } else {
                console.error('Unknown error occurred:', error);
            }
        }
    }
    return {
        addCatalogItem,
        getCatalogItems,
        getCatalogItem,
        editCatalogItem,
        deleteCatalogItem,
    };
}