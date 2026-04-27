import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getPostsId } from '@/services/surah.service';
import { getDoasId } from '@/services/doa.service';

export const useDoaDetailStore = defineStore('doaDetail', () => {
  const doaDetail = ref<{}>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDoas = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await getDoasId(id);
      doaDetail.value = res.data.data;
    } catch (err: any) {
      error.value = err.message || 'Terjadi error';
    } finally {
      loading.value = false;
    }
  };

  return {
    doaDetail,
    loading,
    error,
    fetchDoas,
  };
});
