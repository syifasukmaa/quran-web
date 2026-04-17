<script setup>
defineProps({
  item: Object,
});

const emit = defineEmits(['click']);
</script>

<template>
  <div class="bg-white p-3 rounded-lg border border-primary flex flex-col">
    <p class="font-semibold">{{ item.surahName }} - Ayat {{ item.ayatNumber }}</p>

    <button
      @click="$emit('click')"
      class="mt-3 text-sm bg-primary cursor-pointer text-white px-2 py-1 rounded-lg w-fit font-semibold hover:bg-primary/80 hover:text-white"
    >
      Lanjutkan
    </button>
  </div>
</template>
