import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { createPrayerTime } from "@/services/prayer.service";
import type { PrayerPayload, PrayerTimeData, SavedPrayerLocation } from "@/types/prayer.types";

export const usePrayerTimeStore = defineStore("prayerTime", () => {
    const prayerTimeData = ref<PrayerTimeData | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const locationName = ref("");
    const locationType = ref<"auto" | "manual" | null>(null);

    const savedLocation = localStorage.getItem("prayerLocation");
    if (savedLocation) {
        const parsed = JSON.parse(savedLocation);
        locationName.value = parsed.locationName || "";
        locationType.value = parsed.locationType || null;
    }

    const todaySchedule = computed(() => {
        if (!prayerTimeData.value?.jadwal) return null;
        const today = new Date().getDate();
        return prayerTimeData.value.jadwal.find((j) => j.tanggal === today) || null;
    });

    const fetchPrayerTime = async (payload: PrayerPayload) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await createPrayerTime(payload);
            prayerTimeData.value = res.data.data;
        } catch (err: any) {
            error.value = err.message || "Terjadi error";
        } finally {
            loading.value = false;
        }
    };

    const setLocation = (name: string, type: "auto" | "manual", city?: string, province?: string) => {
        locationName.value = name;
        locationType.value = type;

        const payload: SavedPrayerLocation = {
            locationName: name,
            locationType: type,
            city,
            province,
        };

        localStorage.setItem("prayerLocation", JSON.stringify(payload));
    };

    const clearLocation = () => {
        locationName.value = "";
        locationType.value = null;
        prayerTimeData.value = null;
        localStorage.removeItem("prayerLocation");
    };

    return {
        prayerTimeData,
        todaySchedule,
        loading,
        error,
        locationName,
        locationType,
        fetchPrayerTime,
        setLocation,
        clearLocation,
    };
});
