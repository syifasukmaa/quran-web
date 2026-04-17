<script setup lang="ts">
import 'primeicons/primeicons.css';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1">
      <router-view />
    </div>

    <footer class="text-center text-sm text-gray-500 py-6 border-t bg-white">
      <p>© 2026 Qur’an Web</p>
      <p class="mt-1">Temani setiap langkah dalam membaca dan memahami Al-Qur’an.</p>
    </footer>
  </div>
</template>
<style scoped></style>
