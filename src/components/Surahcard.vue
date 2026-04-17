<script setup>
defineProps({
  surah: Object,
});

const emit = defineEmits(['click']);
</script>

<template>
  <div
    @click="$emit('click')"
    class="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-3 items-center">
        <div class="rounded-full bg-primary/10 px-3 py-1 border border-primary text-primary font-bold">
          {{ surah.nomor }}
        </div>

        <div>
          <div class="flex gap-2 items-center">
            <h1 class="font-semibold">{{ surah.namaLatin }}</h1>
            <span class="text-sm text-primary">({{ surah.arti }})</span>
          </div>

          <div class="flex gap-2 mt-1 text-sm text-gray-500">
            <span>{{ surah.jumlahAyat }} Ayat</span>
            <span>|</span>
            <span>{{ surah.tempatTurun }}</span>
          </div>
        </div>
      </div>

      <div class="font-bold text-primary">
        {{ surah.nama }}
      </div>
    </div>
  </div>
</template>
