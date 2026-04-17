<script setup>
defineProps({
  ayat: Object,
  isBookmarked: Boolean,
});

const emit = defineEmits(['play', 'bookmark']);
</script>

<template>
  <div class="py-2">
    <p class="text-right text-2xl font-semibold">
      {{ ayat.teksArab }}
      <span class="border px-2 py-1 text-xs">{{ ayat.nomorAyat }}</span>
    </p>

    <p class="text-primary font-semibold mt-5 text-lg">
      {{ ayat.teksLatin }}
    </p>

    <p class="mt-3 text-lg">{{ ayat.nomorAyat }}. {{ ayat.teksIndonesia }}</p>

    <div class="flex items-center gap-3 mt-4">
      <i
        class="pi pi-play-circle text-3xl cursor-pointer"
        @click="$emit('play')"
      ></i>

      <i
        class="pi text-2xl cursor-pointer"
        :class="isBookmarked ? 'pi-bookmark-fill text-yellow-500' : 'pi-bookmark'"
        @click="$emit('bookmark')"
      ></i>
    </div>
  </div>
</template>
