<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { usePrayerTimeStore } from "@/stores/prayerTime";
import { useProvinceStore } from "@/stores/province";
import { reverseGeocode } from "@/services/prayer.service";

const store = usePrayerTimeStore();
const provinceStore = useProvinceStore();
const now = new Date();

const showManual = ref(false);
const geoLoading = ref(false);
const geoError = ref("");

const selectedProvince = ref("");
const selectedCity = ref("");
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());
const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const prayerIcons: Record<string, string> = {
    Subuh: "pi-moon",
    Dzuhur: "pi-sun",
    Ashar: "pi-cloud-sun",
    Maghrib: "pi-sunset",
    Isya: "pi-star",
};

const prayers = computed(() => {
    const s = store.todaySchedule;
    if (!s) return null;
    return {
        Subuh: s.subuh,
        Dzuhur: s.dzuhur,
        Ashar: s.ashar,
        Maghrib: s.maghrib,
        Isya: s.isya,
    };
});

const nextPrayer = computed(() => {
    if (!prayers.value) return null;
    const currentMins = now.getHours() * 60 + now.getMinutes();
    for (const [name, time] of Object.entries(prayers.value)) {
        const [h, m] = time.split(":").map(Number);
        if ((h ?? 0) * 60 + (m ?? 0) > currentMins) return { name, time };
    }
    return { name: "Subuh", time: prayers.value.Subuh };
});

const dateStr = computed(() => {
    const s = store.todaySchedule;
    if (s) return `${s.hari}, ${s.tanggal} ${store.prayerTimeData?.bulan_nama} ${store.prayerTimeData?.tahun}`;
    return now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
});

watch(selectedProvince, (val) => {
    selectedCity.value = "";
    if (val) provinceStore.fetchCities(val);
});

async function openManual() {
    showManual.value = !showManual.value;
    if (showManual.value) {
        geoError.value = "";
        await provinceStore.fetchProvinces();
    }
}

async function handleManualSubmit() {
    if (!selectedCity.value || !selectedProvince.value) return;
    store.setLocation(`${selectedCity.value}, ${selectedProvince.value}`, "manual", selectedCity.value, selectedProvince.value);
    await store.fetchPrayerTime({
        kabkota: selectedCity.value,
        provinsi: selectedProvince.value,
        bulan: selectedMonth.value,
        tahun: selectedYear.value,
    });
    showManual.value = false;
}

async function handleAutoLocation() {
    if (!navigator.geolocation) {
        geoError.value = "Browser tidak mendukung geolokasi";
        showManual.value = true;
        provinceStore.fetchProvinces();
        return;
    }
    geoLoading.value = true;
    geoError.value = "";
    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            try {
                const { city, province } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                await provinceStore.fetchProvinces();
                const matchedProvince = provinceStore.provinces.find((p) => province.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(province.toLowerCase()));
                if (!matchedProvince) {
                    geoError.value = "";
                    showManual.value = true;
                    selectedProvince.value = "";
                    geoLoading.value = false;
                    return;
                }
                await provinceStore.fetchCities(matchedProvince);

                const matchedCity = provinceStore.cities.find((c) => city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(city.toLowerCase()));
                if (!matchedCity) {
                    geoError.value = "";
                    selectedProvince.value = matchedProvince;
                    showManual.value = true;
                    geoLoading.value = false;
                    return;
                }
                store.setLocation(`${matchedCity}, ${matchedProvince}`, "auto", matchedCity, matchedProvince);
                await store.fetchPrayerTime({
                    kabkota: matchedCity,
                    provinsi: matchedProvince,
                    bulan: now.getMonth() + 1,
                    tahun: now.getFullYear(),
                });
            } catch {
                geoError.value = "Gagal mendapatkan data lokasi";
                showManual.value = true;
                await provinceStore.fetchProvinces();
            } finally {
                geoLoading.value = false;
            }
        },
        () => {
            geoLoading.value = false;
            geoError.value = "";
            showManual.value = true;
            selectedProvince.value = "";
            provinceStore.fetchProvinces();
        },
    );
}

onMounted(async () => {
    const saved = localStorage.getItem("prayerLocation");
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.city && parsed.province) {
            await store.fetchPrayerTime({
                kabkota: parsed.city,
                provinsi: parsed.province,
                bulan: now.getMonth() + 1,
                tahun: now.getFullYear(),
            });
        }
    }
});
</script>

<template>
    <div class="bg-white dark:bg-slate-800 drop-shadow-md rounded-xl px-4 py-4 lg:mt-6 mt-12">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
            <div>
                <h1 class="text-lg font-bold dark:text-white">Jadwal Sholat</h1>
                <p class="text-sm text-gray-500 dark:text-slate-400">{{ dateStr }}</p>
            </div>
            <button
                @click="openManual"
                class="rounded-full px-3 py-1.5 text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 dark:border-teal-400 dark:text-teal-400 cursor-pointer"
            >
                <i class="pi pi-pen-to-square mr-2"></i> Ubah Lokasi
            </button>
        </div>

        <div v-if="store.locationName" class="mb-3">
            <span
                class="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1 rounded-full dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400"
            >
                <i :class="store.locationType === 'auto' ? 'pi pi-map-marker' : 'pi pi-map'" />
                {{ store.locationName }}
                <span v-if="store.locationType === 'auto'" class="bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold"> AUTO </span>
            </span>
        </div>
        <div v-else class="mb-3">
            <span class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                Lokasi belum diatur
            </span>
        </div>

        <div v-if="!store.locationName && !showManual" class="bg-primary rounded-xl py-3 px-4 flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
                <div class="bg-white/20 p-2.5 rounded-lg">
                    <i class="pi pi-map-marker text-white text-lg" />
                </div>
                <div class="text-white">
                    <p class="font-semibold text-sm">Aktifkan Lokasi Otomatis</p>
                    <p class="text-xs opacity-80">Izinkan akses lokasi untuk jadwal sholat akurat</p>
                </div>
            </div>
            <div class="flex flex-col gap-1.5 flex-shrink-0">
                <button
                    @click="handleAutoLocation"
                    :disabled="geoLoading"
                    class="rounded-full px-3 py-1.5 text-xs font-bold bg-white text-primary hover:bg-gray-100 transition-all disabled:opacity-60 cursor-pointer"
                >
                    {{ geoLoading ? "Mendeteksi..." : "Izinkan" }}
                </button>
                <button
                    @click="
                        showManual = true;
                        provinceStore.fetchProvinces();
                        geoError = '';
                    "
                    class="rounded-full px-3 py-1.5 text-xs border border-white/60 text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                    Nanti Saja
                </button>
            </div>
        </div>

        <p v-if="geoError" class="text-xs text-red-500 mb-3">⚠️ {{ geoError }}</p>

        <div v-if="store.loading" class="flex items-center justify-center py-8">
            <i class="pi pi-spin pi-spinner text-primary text-2xl" />
        </div>

        <div v-if="store.todaySchedule && !store.loading" class="flex gap-2 mb-3">
            <div class="flex-1 bg-blue-50 dark:bg-slate-700 rounded-xl px-3 py-2 text-center border border-blue-100 dark:border-slate-600">
                <p class="text-[12px] text-blue-400 font-bold mb-0.5">Imsak</p>
                <p class="text-sm font-black text-blue-600 dark:text-blue-400">{{ store.todaySchedule.imsak }}</p>
            </div>
            <div class="flex-1 bg-orange-50 dark:bg-slate-700 rounded-xl px-3 py-2 text-center border border-orange-100 dark:border-slate-600">
                <p class="text-[12px] text-orange-400 font-bold mb-0.5">Terbit</p>
                <p class="text-sm font-black text-orange-500 dark:text-orange-400">{{ store.todaySchedule.terbit }}</p>
            </div>
            <div class="flex-1 bg-yellow-50 dark:bg-slate-700 rounded-xl px-3 py-2 text-center border border-yellow-100 dark:border-slate-600">
                <p class="text-[12px] text-yellow-500 font-bold mb-0.5">Dhuha</p>
                <p class="text-sm font-black text-yellow-600 dark:text-yellow-400">{{ store.todaySchedule.dhuha }}</p>
            </div>
        </div>

        <div v-if="prayers && nextPrayer && !store.loading" class="bg-gradient-to-r from-primary to-teal-400 rounded-xl p-4 flex items-center justify-between mb-4">
            <div>
                <p class="text-xs text-white/70 font-bold uppercase tracking-wider mb-1">Sholat Berikutnya</p>
                <p class="text-xl font-bold text-white flex items-center gap-2">
                    {{ nextPrayer.name }}
                </p>
            </div>
            <p class="text-3xl font-black text-white tracking-tight">{{ nextPrayer.time }}</p>
        </div>

        <div v-if="prayers && !store.loading" class="grid grid-cols-5 gap-2 mb-2">
            <div
                v-for="(time, name) in prayers"
                :key="name"
                :class="[
                    'text-center py-2.5 px-1 rounded-xl border transition-all',
                    name === nextPrayer?.name
                        ? 'bg-primary/10 border-primary dark:bg-teal-900/30 dark:border-teal-500'
                        : 'bg-gray-50 border-gray-100 dark:bg-slate-700 dark:border-slate-600',
                ]"
            >
                <p :class="['text-[12px] font-bold mb-0.5', name === nextPrayer?.name ? 'text-primary' : 'text-gray-500 dark:text-slate-400']">
                    {{ name }}
                </p>
                <p :class="['text-xs font-black', name === nextPrayer?.name ? 'text-primary' : 'text-gray-800 dark:text-white']">
                    {{ time }}
                </p>
            </div>
        </div>

        <div v-if="showManual" class="mt-4 border border-dashed border-gray-200 dark:border-slate-600 rounded-xl p-4 bg-gray-50 dark:bg-slate-700/50">
            <p class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-3">Atur Lokasi Manual</p>
            <div v-if="selectedProvince && !selectedCity" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    Provinsi terdeteksi: <strong>{{ selectedProvince }}</strong
                    ><br />
                    Silakan pilih kota/kabupaten secara manual.
                </p>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
                <!-- Provinsi -->
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-slate-300 block mb-1">Provinsi</label>
                    <select
                        v-model="selectedProvince"
                        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-sm text-gray-800 dark:text-white outline-none focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="" disabled>
                            {{ provinceStore.loadingProvince ? "Memuat..." : "Pilih Provinsi" }}
                        </option>
                        <option v-for="p in provinceStore.provinces" :key="p" :value="p">{{ p }}</option>
                    </select>
                </div>

                <!-- Kota -->
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-slate-300 block mb-1">Kota / Kabupaten</label>
                    <select
                        v-model="selectedCity"
                        :disabled="!selectedProvince || provinceStore.loadingCity"
                        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-sm text-gray-800 dark:text-white outline-none focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <option value="" disabled>
                            {{ provinceStore.loadingCity ? "Memuat kota..." : "Pilih Kota" }}
                        </option>
                        <option v-for="c in provinceStore.cities" :key="c" :value="c">{{ c }}</option>
                    </select>
                </div>

                <!-- Bulan -->
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-slate-300 block mb-1">Bulan</label>
                    <select
                        v-model="selectedMonth"
                        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-sm text-gray-800 dark:text-white outline-none focus:border-primary transition-all cursor-pointer"
                    >
                        <option v-for="(m, i) in MONTHS" :key="i" :value="i + 1">{{ m }}</option>
                    </select>
                </div>

                <!-- Tahun -->
                <div>
                    <label class="text-xs font-bold text-gray-600 dark:text-slate-300 block mb-1">Tahun</label>
                    <select
                        v-model="selectedYear"
                        class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-700 text-sm text-gray-800 dark:text-white outline-none focus:border-primary transition-all cursor-pointer"
                    >
                        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                    </select>
                </div>
            </div>

            <div class="flex gap-2">
                <button
                    @click="handleManualSubmit"
                    :disabled="!selectedCity || store.loading"
                    class="flex-1 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {{ store.loading ? "Memuat..." : "Simpan & Tampilkan" }}
                </button>
                <button
                    @click="showManual = false"
                    class="px-4 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-slate-500 dark:text-slate-400 dark:hover:bg-slate-700 transition-all"
                >
                    Batal
                </button>
            </div>
        </div>
    </div>
</template>
