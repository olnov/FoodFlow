<script setup lang="ts">
import { useCatalog } from "~/composables/useCatalog";
import { useInventory } from "~/composables/useInventory";
import type {InventoryItem} from "~/types/inventory";
import {onMounted, ref} from 'vue'
import type {CatalogItem} from "~/types/catalog";

const { getCatalogItems } = useCatalog();
const { getInventoryItems } = useInventory();

const catalogItems = ref<CatalogItem[]>([])
const inventoryItems = ref<InventoryItem[]>([])

definePageMeta({
  layout: 'admin',
});

onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return navigateTo('/forbidden')
  }
  catalogItems.value = await getCatalogItems();
  inventoryItems.value = await getInventoryItems();
})
</script>

<template>
  <UContainer style="display: flex; flex-direction: row; justify-content: center; margin-bottom: 10px">
    <h2>ProductFlow Dashboard</h2>
  </UContainer>
  <UContainer style="display: flex; flex-direction: row; justify-content: center; gap: 20px">
    <UCard>
        Total inventory items: {{inventoryItems.length}} items
    </UCard>
    <UCard>
        Total catalog items: {{catalogItems.length}} items
    </UCard>
  </UContainer>
</template>


<style scoped>

</style>