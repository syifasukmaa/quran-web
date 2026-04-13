<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useSurahDetailStore } from '@/stores/surah-detail';

const route = useRoute();

const surahStore = useSurahDetailStore();

onMounted(async () => {
  await surahStore.fetchSurahs(Number(route.params.id));
  console.log('ID:', surahStore.surahDetail);
});
</script>

<template>
  <h1>Detail Surah ID: {{ surahStore.surahDetail }}</h1>
</template>
