import type { InventoryItem } from "~/types/inventory";
import type { NitroFetchOptions } from "nitropack/types";
import type {CatalogItem} from "~/types/catalog";

export const useInventory = () => {
    const config = useRuntimeConfig();
    const BACKEND_URL = config.public.BACKEND_URL;

    const addInventoryItem = async (item: Partial<InventoryItem>) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }

        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: item,
            }

            return await $fetch(`${BACKEND_URL}/inventory/api/v1/inventory`, requestOptions);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Can\'t add an inventory item',
                });
            } else {
                console.error(error)
                throw createError({
                    message: 'Something went wrong, please check the log',
                })
            }
        }
    }

    const getInventoryItems = async (): Promise<InventoryItem[]> => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error('Unauthorized');
        }

        try {
            const requestOptions: NitroFetchOptions<any> = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

            return await $fetch(`${BACKEND_URL}/inventory/api/v1/inventory`, requestOptions);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw createError({
                    message: error.message || 'Can\'t get inventory items',
                })
            } else {
                console.error(error)
                throw createError({
                    message: 'Something went wrong, please check the log',
                })
            }
        }
    }

    return {
        addInventoryItem,
        getInventoryItems,
    }
}