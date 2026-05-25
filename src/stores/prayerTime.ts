
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { createPrayerTime } from '@/services/prayer.service';

interface JadwalItem {
  tanggal: number;
  tanggal_lengkap: string;
  hari: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface PrayerTimeData {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: JadwalItem[];
}

export const usePrayerTimeStore = defineStore('prayerTime', () => {
  const prayerTimeData = ref<PrayerTimeData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const locationName = ref('');
  const locationType = ref<'auto' | 'manual' | null>(null);

  
  const savedLocation = localStorage.getItem('prayerLocation');
  if (savedLocation) {
    const parsed = JSON.parse(savedLocation);
    locationName.value = parsed.locationName || '';
    locationType.value = parsed.locationType || null;
  }

  
  const todaySchedule = computed(() => {
    if (!prayerTimeData.value?.jadwal) return null;
    const today = new Date().getDate(); 
    return prayerTimeData.value.jadwal.find(j => j.tanggal === today) || null;
  });

  const fetchPrayerTime = async (payload: {
    kabkota: string;
    provinsi: string;
    bulan: number;
    tahun: number;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await createPrayerTime(payload);
      prayerTimeData.value = res.data.data; 
    } catch (err: any) {
      error.value = err.message || 'Terjadi error';
    } finally {
      loading.value = false;
    }
  };

  const setLocation = (
    name: string,
    type: 'auto' | 'manual',
    city?: string,
    province?: string
  ) => {
    locationName.value = name;
    locationType.value = type;
    localStorage.setItem('prayerLocation', JSON.stringify({
      locationName: name,
      locationType: type,
      city,
      province,
    }));
  };

  const clearLocation = () => {
    locationName.value = '';
    locationType.value = null;
    prayerTimeData.value = null;
    localStorage.removeItem('prayerLocation');
  };

  return {
    prayerTimeData,
    todaySchedule, 
    loading, error,
    locationName, locationType,
    fetchPrayerTime, setLocation, clearLocation,
  };
});