<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
});
</script>

<template>
  <UContainer style="display: flex; flex-direction: row; justify-content: center; margin-bottom: 10px">
    <h2>ProductFlow Dashboard</h2>
  </UContainer>
  <UContainer style="display: flex; flex-direction: row; justify-content: center; gap: 20px">
    <UCard>
        Total inventory items: 0
    </UCard>
    <UCard>
        Total catalog items: 0
    </UCard>
  </UContainer>
</template>


<style scoped>

</style>