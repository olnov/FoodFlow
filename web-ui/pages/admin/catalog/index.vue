<script setup lang="ts">
import {getPaginationRowModel} from '@tanstack/vue-table'
import {h, onMounted, ref, computed, watch, reactive} from 'vue'
import type {FormSubmitEvent, TableColumn} from '@nuxt/ui'
import {UButton} from "#components"
import {useCatalog} from "~/composables/useCatalog"
import type {CatalogItem} from "~/types/catalog"

definePageMeta({
  layout: 'admin',
})

// Composables and Refs
const {deleteCatalogItem, addCatalogItem, getCatalogItems, editCatalogItem} = useCatalog()
const toast = useToast()
const table = ref()
const UBadge = resolveComponent('UBadge')

// State
const isOpen = ref(false)
const isEditing = ref(false)
const globalFilter = ref('')
const data = ref<CatalogItem[]>([])

// Pagination
const pagination = ref({
  pageIndex: 0,
  pageSize: 8
})

// Form
const initialFormState = {
  _id: '',
  name: '',
  description: '',
  unit: '',
  imageUrl: '',
  isActive: true,
}
const item = reactive<Partial<CatalogItem>>({...initialFormState})

// Computed rows for pagination
const filteredData = computed(() => {
  if (!globalFilter.value) return data.value
  return data.value.filter((item) =>
      Object.values(item).some((val) =>
          String(val).toLowerCase().includes(globalFilter.value.toLowerCase())
      )
  )
})


const columns: TableColumn<CatalogItem>[] = [
  {
    accessorKey: '_id',
    header: '#',
    cell: ({row}) => row.getValue('_id'),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
  },
  {
    accessorKey: 'isActive',
    header: 'Availability status',
    cell: ({row}) => {
      const isActive = Boolean(row.getValue('isActive'))
      const color = isActive ? 'success' : 'error'
      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        color
      }, () => isActive ? 'Available' : 'Not available')
    }
  },
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({row}) => {
      const imageUrl = row.getValue('imageUrl') as string
      return h('img', {src: imageUrl, class: 'w-10 h-10 object-cover rounded'})
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({row}) => new Date(row.getValue('createdAt')).toLocaleDateString(),
  },
  {
    header: 'Actions',
    cell: ({row}) => {
      return h('div', {class: 'flex gap-2'}, [
        h(UButton, {
          size: 'xs',
          onClick: () => handleEdit(row.original),
        }, () => 'Edit'),

        h(UButton, {
          size: 'xs',
          onClick: () => handleDelete(row.original._id),
        }, () => 'Delete'),
      ])
    }
  }
]

// Methods
const handleEdit = (selectedItem: CatalogItem) => {
  Object.assign(item, selectedItem)
  isEditing.value = true
  isOpen.value = true
}

const handleAdd = () => {
  Object.assign(item, initialFormState)
  isEditing.value = false
  isOpen.value = true
}

async function handleSubmit(event: FormSubmitEvent<typeof item>) {
  try {
    if (isEditing.value && item._id) {
      await editCatalogItem(item._id, item)
      toast.add({title: 'Item updated successfully', color: 'success'})
    } else {
      await addCatalogItem(item)
      toast.add({title: 'Item added successfully', color: 'success'})
    }
    isOpen.value = false
    await loadCatalogItems()
    if (table.value?.tableApi) {
      table.value.tableApi.setPageIndex(0)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({title: 'Operation failed', color: 'error'})
    } else {
      console.error(error)
    }
  }
}

const handleDelete = async (id: string) => {
  try {
    await deleteCatalogItem(id)
    await loadCatalogItems()
    toast.add({title: 'Successfully deleted item', color: 'success'})
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({title: 'Deletion failed', description: error.message, color: 'error'})
    } else {
      console.error(error)
    }
  }
}

const loadCatalogItems = async () => {
  data.value = await getCatalogItems()
}

watch(globalFilter, () => {
  // Reset to first page when filtering
  if (table.value?.tableApi) {
    table.value.tableApi.setPageIndex(0)
  }
})

onMounted(async () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    return navigateTo('/forbidden')
  }
  await loadCatalogItems()
})
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex justify-between items-center mb-4">
      <UInput
          v-model="globalFilter"
          placeholder="Filter items..."
          class="max-w-sm"
      />
      <UButton color="primary" @click="handleAdd">
        Add catalog item
      </UButton>
    </div>

    <UTable
        ref="table"
        v-model:pagination="pagination"
        :data="filteredData"
        :columns="columns"
        :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
    />

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination
          :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>

    <UModal v-model:open="isOpen">
      <template #header>
        <h2 class="font-semibold text-lg">
          {{ isEditing ? 'Edit Item' : 'Add Item' }}
        </h2>
      </template>
      <template #body>
        <UCard>
          <UForm :state="item" class="space-y-4" @submit="handleSubmit">
            <UFormField label="Name" name="name">
              <UInput v-model="item.name" class="w-full"/>
            </UFormField>

            <UFormField label="Description" name="description">
              <UInput v-model="item.description" class="w-full"/>
            </UFormField>

            <UFormField label="Unit" name="unit">
              <UInput v-model="item.unit" class="w-full"/>
            </UFormField>

            <UFormField label="Image URL" name="imageUrl">
              <UInput v-model="item.imageUrl" class="w-full"/>
            </UFormField>

            <UFormField label="Is Active" name="isActive">
              <UCheckbox v-model="item.isActive"/>
            </UFormField>

            <div class="flex justify-end gap-2 pt-2">
              <UButton type="submit" color="primary">
                {{ isEditing ? 'Update' : 'Create' }}
              </UButton>
              <UButton color="neutral" @click="isOpen = false">
                Cancel
              </UButton>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>
</template>