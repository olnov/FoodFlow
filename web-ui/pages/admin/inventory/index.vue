<script setup lang="ts">
import {h, onMounted, reactive, ref, computed, watch} from 'vue'
import type {FormSubmitEvent, TableColumn} from '@nuxt/ui'
import {useInventory} from '~/composables/useInventory'
import {useCatalog} from '~/composables/useCatalog';
import type {InventoryItem} from '~/types/inventory'
import {UButton} from "#components";
import type {CatalogItem} from '~/types/catalog';


definePageMeta({
  layout: 'admin',
})

const {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} = useInventory()


const {getCatalogItems} = useCatalog()
const toast = useToast()


const data = ref<InventoryItem[]>([])
const isOpen = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const catalogItems = ref<CatalogItem[]>([])
const searchResults = ref<CatalogItem[]>([])

const initialFormState = {
  _id: '',
  catalogItemId: '',
  quantity: 0,
  price: 0,
}

const item = reactive<Partial<InventoryItem>>({...initialFormState})
const globalFilter = ref('')

watch(searchQuery, async (newQuery) => {
  if (newQuery.length < 2) {
    searchResults.value = []
    return
  }
  searchResults.value = await getCatalogItems(newQuery)
})

const selectItem = (catalogItem: CatalogItem) => {
  item.catalogItemId = catalogItem._id
  searchQuery.value = catalogItem.name
  searchResults.value = []
}

const inventoryWithCatalogNames = computed(() => {
  return data.value.map(item => ({
    ...item,
    catalogItemName: catalogItems.value.find(c => c._id === item.catalogItemId)?.name || 'Unknown',
  }))
})

const columns: TableColumn<InventoryItem>[] = [
  {accessorKey: '_id', header: 'ID'},
  {accessorKey: 'catalogItemName', header: 'Catalog Item Name'},
  {accessorKey: 'quantity', header: 'Quantity'},
  {accessorKey: 'price', header: 'Price', cell: ({row}) => `$${row.original.price}`},
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({row}) => new Date(row.getValue('createdAt')).toLocaleDateString()
  },
  {
    header: 'Actions',
    cell: ({row}) => h('div', {class: 'flex gap-2'}, [
      h(UButton, {size: 'xs', onClick: () => handleEdit(row.original)}, 'Edit'),
      h(UButton, {size: 'xs', onClick: () => handleDelete(row.original._id)}, 'Delete'),
    ])
  }
]

function handleEdit(selectedItem: InventoryItem) {
  Object.assign(item, selectedItem)
  searchQuery.value = catalogItems.value.find(c => c._id === item.catalogItemId)?.name || ''
  isEditing.value = true
  isOpen.value = true
}

function handleAdd() {
  Object.assign(item, initialFormState)
  searchQuery.value = ''
  isEditing.value = false
  isOpen.value = true
}

async function handleDelete(id: string) {
  try {
    await deleteInventoryItem(id)
    data.value = data.value.filter(i => i._id !== id)
    toast.add({title: 'Item deleted successfully', color: 'success'})
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({title: 'Deletion failed', color: 'error'})
    } else {
      console.error(error)
    }
  }
}

async function handleSubmit(event: FormSubmitEvent<typeof item>) {
  try {
    if (isEditing.value && item._id) {
      await updateInventoryItem(item._id, item)
      toast.add({title: 'Item updated successfully', color: 'success'})
    } else {
      await addInventoryItem(item)
      toast.add({title: 'Item added successfully', color: 'success'})
    }
    isOpen.value = false
    data.value = await getInventoryItems()
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({title: 'Operation failed', color: 'error'})
    } else {
      console.error(error)
    }
  }
}

onMounted(async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return navigateTo('/forbidden')
  }
  data.value = await getInventoryItems()
  catalogItems.value = await getCatalogItems()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <UInput v-model="globalFilter" placeholder="Filter items..." class="max-w-sm"/>
      <UButton color="primary" @click="handleAdd">Add inventory item</UButton>
    </div>

    <UTable :columns="columns" :data="inventoryWithCatalogNames" :global-filter="globalFilter"/>

    <UModal v-model:open="isOpen">
      <template #header>
        <h2 class="font-semibold text-lg">{{ isEditing ? 'Edit Inventory Item' : 'Add Inventory Item' }}</h2>
      </template>
      <template #body>
        <UCard>
          <UForm :state="item" class="space-y-4" @submit="handleSubmit">
            <UFormField label="Catalog Item" name="catalogItemSearch">
              <UInput v-model="searchQuery" placeholder="Type to search catalog..."/>
              <div v-if="searchResults.length" class="mt-2 bg-white shadow rounded max-h-40 overflow-auto">
                <div
                    v-for="item in searchResults" :key="item._id"
                    class="p-2 cursor-pointer hover:bg-gray-100"
                    @click="selectItem(item)">
                  {{ item.name }}
                </div>
              </div>
            </UFormField>

            <UFormField label="Quantity" name="quantity">
              <UInput v-model.number="item.quantity" type="number"/>
            </UFormField>

            <UFormField label="Price" name="price">
              <UInput v-model.number="item.price" type="number"/>
            </UFormField>

            <div class="flex justify-end gap-2">
              <UButton color="neutral" @click="isOpen = false">Cancel</UButton>
              <UButton type="submit" color="primary">{{ isEditing ? 'Update' : 'Create' }}</UButton>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>
</template>