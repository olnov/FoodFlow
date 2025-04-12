<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white text-gray-500 flex flex-col p-4 space-y-4 shadow-primary-50">
      <h2 class="text-xl font-bold mb-4">Control panel</h2>
      <NuxtLink to="/admin" class="hover:text-blue-400">Dashboard</NuxtLink>
      <NuxtLink to="/admin/inventory" class="hover:text-blue-400">Inventory</NuxtLink>
      <NuxtLink to="/admin/catalog" class="hover:text-blue-400">Catalog</NuxtLink>
      <UButton icon="material-symbols:exit-to-app-sharp" class="mt-auto text-center" @click="logout">Logout</UButton>
    </aside>

    <main class="flex-1 bg-gray-100 p-6 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
