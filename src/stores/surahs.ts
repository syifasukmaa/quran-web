import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getPosts } from '@/services/surah.service';

export const useSurahStore = defineStore('surah', () => {
  const surahs = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchSurahs = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await getPosts();
      surahs.value = res.data.data;
    } catch (err: any) {
      error.value = err.message || 'Terjadi error';
    } finally {
      loading.value = false;
    }
  };

  return {
    surahs,
    loading,
    error,
    fetchSurahs,
  };
});
