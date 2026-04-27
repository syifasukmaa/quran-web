<script setup>
import { useSurahStore } from '@/stores/surahs';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  search: String,
});

const router = useRouter();
const surahStore = useSurahStore();

onMounted(() => {
  surahStore.fetchSurahs();
});

const filteredSurah = computed(() => {
  return surahStore.surahs.filter((surah) =>
    surah.namaLatin.toLowerCase().includes((props.search || '').toLowerCase()),
  );
});

const goToDetail = (id) => {
  router.push(`/quran/surah/${id}`);
};
</script>

<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      class="bg-white drop-shadow-lg rounded-xl cursor-pointer px-4 py-4"
      v-for="surah in filteredSurah"
      :key="surah.nomor"
      @click="goToDetail(surah.nomor)"
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

        <div class="text-lg font-bold text-primary">
          <p>{{ surah.nama }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped>
.badge {
  @apply rounded-full bg-primary/10 px-3 py-1 border border-primary text-primary font-bold text-sm;
}

.title {
  @apply font-semibold text-black;
}

.desc {
  @apply text-gray-500 text-sm;
}

.arab {
  @apply text-xl font-bold text-primary;
  direction: rtl;
}
</style> -->
