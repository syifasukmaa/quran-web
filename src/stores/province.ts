import { ref } from "vue";
import { defineStore } from "pinia";
import { getProvince } from "@/services/prayer.service";

export const useProvinceStore = defineStore("province", () => {
    const provinces = ref<string[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchProvinces = async () => {
        if (provinces.value.length > 0) return;

        loading.value = true;
        error.value = null;

        try {
            const res = await getProvince();

            provinces.value = res.data.data;
        } catch (err: any) {
            error.value = err.message || "Gagal memuat provinsi";
        } finally {
            loading.value = false;
        }
    };

    return {
        provinces,
        loading,
        error,
        fetchProvinces,
    };
});
