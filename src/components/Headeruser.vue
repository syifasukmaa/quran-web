<script setup>
defineProps({
  name: String,
  showBack: Boolean,
});
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <div
      v-if="showBack"
      class="flex items-center gap-2 cursor-pointer"
    >
      <i class="pi pi-arrow-left"></i>
      <slot name="backText">Kembali</slot>
    </div>

    <p class="text-white font-semibold text-base lg:text-xl">Quran App</p>

    <div class="flex items-center gap-3">
      <p class="text-white font-semibold">{{ name }}</p>
      <div class="rounded-full bg-primary/10 px-3 py-2 border border-white text-white font-bold">
        {{ name?.slice(0, 2).toUpperCase() }}
      </div>
    </div>
  </div>
</template>
