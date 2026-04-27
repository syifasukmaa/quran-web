<script setup>
defineProps({
  item: Object,
});

const emit = defineEmits(['click']);
</script>

<template>
  <div
    class="bg-white p-3 rounded-lg border border-gray-500 flex flex-col hover:border-primary hover:bg-gray-300/70 cursor-pointer transition-all h-24"
    @click="$emit('click')"
  >
    <div class="flex justify-between items-center">
      <p class="font-semibold">{{ item.surahName }} - Ayat {{ item.ayatNumber }}</p>

      <i class="pi pi-bookmark-fill"></i>
    </div>

    <div class="mt-3">
      <p
        class="text-right text-lg line-clamp-1"
        dir="rtl"
      >
        {{ item.arabText }}
      </p>
    </div>
  </div>
</template>
