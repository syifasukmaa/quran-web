import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getDoas } from '@/services/doa.service';

export const useDoaStore = defineStore('doa', () => {
  const doas = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDoas = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await getDoas();
      doas.value = res.data.data;
    } catch (err: any) {
      error.value = err.message || 'Terjadi error';
    } finally {
      loading.value = false;
    }
  };

  return {
    doas,
    loading,
    error,
    fetchDoas,
  };
});
