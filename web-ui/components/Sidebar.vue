<script setup lang="ts">

</script>

<template>
  <sidebar>
    <div class="left">
      <img src="~/assets/img/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="right">
      <NuxtLink to="/login">Catalog Items</NuxtLink>
      <NuxtLink to="/about">Inventory Items</NuxtLink>
      <NuxtLink to="/logout">Logout</NuxtLink>
    </div>
  </sidebar>
</template>

<style scoped>
sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

</style>