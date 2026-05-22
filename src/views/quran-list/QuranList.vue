<script setup>
import { useSurahStore } from '@/stores/surahs';
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  search: String,
});

const route = useRoute();
const router = useRouter();
const surahStore = useSurahStore();

onMounted(() => {
  if (!surahStore.surahs.length) {
    surahStore.fetchSurahs();
  }
});

const filteredSurah = computed(() => {
  return surahStore.surahs.filter((surah) =>
    surah.namaLatin.toLowerCase().includes((props.search || '').toLowerCase()),
  );
});

const goToDetail = (id) => {
  router.push(`/quran/surah/${id}`);
};

watch(
  () => route.fullPath,
  () => {
    surahStore.fetchSurahs();
  },
);
</script>

<template>

    <div v-if="filteredSurah.length === 0" class="text-center py-16">
    <i class="pi pi-search text-5xl text-primary mb-4"></i>

    <h1 class="text-xl font-semibold text-primary">
      Pencarian Quran Tidak Ditemukan
    </h1>

    <p class="text-gray-400 mt-2">
      Coba gunakan kata kunci lain
    </p>
  </div>

  <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="(surah, index) in filteredSurah"
      :key="surah.nomor"
      v-animate="{ type: 'fadeUp', delay: index * 2 }"
      @click="goToDetail(surah.nomor)"
      class="bg-white rounded-xl dark:bg-muted/10 cursor-pointer px-4 py-4 hover:border-t-2 hover:border-primary shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:-translate-x-0.5"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            class="rounded-full bg-primary/10 px-4 py-4 border border-primary text-primary font-bold flex items-center justify-center w-[24px] h-[24px]"
          >
            {{ surah.nomor }}
          </div>

          <div class="space-y-2">
            <div class="flex gap-2 items-center">
              <h1 class="font-semibold dark:text-white">{{ surah.namaLatin }}</h1>
              <span class="text-sm text-primary">({{ surah.arti }})</span>
            </div>

            <div class="flex gap-2 mt-1 text-sm text-gray-500">
              <span>{{ surah.jumlahAyat }} Ayat</span>
              <span>|</span>
              <span>{{ surah.tempatTurun }}</span>
            </div>
          </div>
        </div>

        <div class="text-lg font-bold text-primary">
          <p>{{ surah.nama }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
