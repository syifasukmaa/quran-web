import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getPosts, getPostsId } from '@/services/surah.service';

export const useSurahDetailStore = defineStore('surahDetail', () => {
  const surahDetail = ref<{}>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchSurahs = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await getPostsId(id);
      surahDetail.value = res.data.data;
    } catch (err: any) {
      error.value = err.message || 'Terjadi error';
    } finally {
      loading.value = false;
    }
  };

  return {
    surahDetail,
    loading,
    error,
    fetchSurahs,
  };
});
