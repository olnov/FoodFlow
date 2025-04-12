<script setup lang="ts">

</script>

<template>
  <header class="top-bar">
    <div class="left">
      <img src="~/assets/img/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="right">
      <NuxtLink to="/login">Login</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </div>
  </header>
</template>

<style scoped lang="scss">
$bg-color: white;
$text-color: #333;
$text-hover: #000;

.top-bar {
  display: flex;
  font-family: Apple, Helvetica, Arial, sans-serif;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: $bg-color;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
  0 6px 20px rgba(0, 0, 0, 0.19);

  .logo {
    height: 40px;
  }

  .right {
    display: flex;
    gap: 1.5rem;
    align-items: center;

    a {
      text-decoration: none;
      color: $text-color;
      font-weight: 500;

      &:hover {
        color: $text-hover;
      }
    }
  }
}
</style>