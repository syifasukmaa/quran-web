// stores/province.store.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getProvince, postKabKota } from '@/services/prayer.service';

export const useProvinceStore = defineStore('province', () => {
  const provinces = ref<string[]>([]);   
  const cities = ref<string[]>([]);      
  const loadingProvince = ref(false);
  const loadingCity = ref(false);
  const error = ref<string | null>(null);

  const fetchProvinces = async () => {
    if (provinces.value.length > 0) return; 
    loadingProvince.value = true;
    error.value = null;
    try {
      const res = await getProvince();
      provinces.value = res.data.data; 
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat provinsi';
    } finally {
      loadingProvince.value = false;
    }
  };

  const fetchCities = async (provinceName: string) => {
    cities.value = [];
    if (!provinceName) return;
    loadingCity.value = true;
    error.value = null;
    try {
      const res = await postKabKota({ provinsi: provinceName }); 
      cities.value = res.data.data; 
    } catch (err: any) {
      error.value = err.message || 'Gagal memuat kota';
    } finally {
      loadingCity.value = false;
    }
  };

  return {
    provinces, cities,
    loadingProvince, loadingCity, error,
    fetchProvinces, fetchCities,
  };
});