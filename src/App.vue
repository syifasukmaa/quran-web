<script setup lang="ts">
import 'primeicons/primeicons.css';

import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex-1">
      <router-view />
    </div>

    <footer
      class="text-center text-sm text-gray-500 py-6 border-t bg-white"
      v-if="!route.meta.hideFooter"
    >
      <p>© 2026 Qur’an Web</p>
      <p class="mt-1">Temani setiap langkah dalam membaca dan memahami Al-Qur’an.</p>
    </footer>
  </div>
</template>
<style scoped></style>
