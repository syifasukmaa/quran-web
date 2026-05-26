import { ref } from "vue";
import { defineStore } from "pinia";
import { postKabKota } from "@/services/prayer.service";

export const useCityStore = defineStore("city", () => {
    const cities = ref<string[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchCities = async (provinceName: string) => {
        cities.value = [];

        if (!provinceName) return;

        loading.value = true;
        error.value = null;

        try {
            const res = await postKabKota({
                provinsi: provinceName,
            });

            cities.value = res.data.data;
        } catch (err: any) {
            error.value = err.message || "Gagal memuat kota";
        } finally {
            loading.value = false;
        }
    };

    const clearCities = () => {
        cities.value = [];
    };

    return {
        cities,
        loading,
        error,
        fetchCities,
        clearCities,
    };
});
