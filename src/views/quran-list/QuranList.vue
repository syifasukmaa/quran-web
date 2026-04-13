<script setup>
import { useSurahStore } from '@/stores/surahs';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const surahStore = useSurahStore();
const router = useRouter();
const name = ref('');
const activeTab = ref('surah');

onMounted(() => {
  if (!localStorage.getItem('name')) {
    router.push('/');
  }
  name.value = localStorage.getItem('name') || '';
  surahStore.fetchSurahs();
});

const goToDetail = (id) => {
  router.push(`/list-quran/${id}`);
};
</script>
<template>
  <div class="px-4 py-4 lg:px-28 lg:py-10">
    <p v-if="surahStore.loading">Loading...</p>

    <div v-else>
      <div class="flex justify-between items-center mb-8">
        <p class="text-2xl font-bold text-primary">Quran App</p>
        <div class="flex items-center gap-3">
          <p class="text-primary font-semibold">{{ name }}</p>
          <p
            class="rounded-full bg-primary/10 py-1 px-2 lg:py-2 lg:px-3 border border-primary text-primary font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {{ name.slice(0, 2).toUpperCase() }}
          </p>
        </div>
      </div>

      <div class="mb-3 flex justify-center">
        <!-- tambahkan icon search -->
        <input
          type="text"
          placeholder="Pencarian surah dalam Alquran"
          class="w-full lg:w-1/2 border border-primary rounded-lg px-2 py-2 mb-3"
        />
        <i
          class="pi pi-search text-primary"
          style="font-size: 2rem"
        ></i>
      </div>

      <h2 class="text-lg font-bold text-primary mb-2">Kategori</h2>
      <div class="flex gap-2">
        <button
          @click="activeTab = 'surah'"
          :class="[
            'border rounded-lg px-2 py-2 mb-3 font-semibold',
            activeTab === 'surah' ? 'border-yellow-teal bg-yellow-teal text-purple' : 'border-primary text-primary',
          ]"
        >
          Surah
        </button>

        <button
          @click="activeTab = 'juz'"
          :class="[
            'border rounded-lg px-2 py-2 mb-3 font-semibold',
            activeTab === 'juz' ? 'border-yellow-teal bg-yellow-teal text-purple' : 'border-primary text-primary',
          ]"
        >
          Juz
        </button>
      </div>

      <!-- list surah -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="bg-white drop-shadow-lg rounded-xl cursor-pointer px-4 py-4"
          v-for="surah in surahStore.surahs"
          :key="surah.nomor"
          @click="goToDetail(surah.nomor)"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="rounded-full bg-primary/10 py-0.5 px-2 lg:px-6 border border-primary text-primary font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <p>{{ surah.nomor }}</p>
              </div>
              <!-- penjelasan -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <h1 class="font-semibold text-lg">{{ surah.namaLatin }}</h1>
                  <p class="text-sm text-primary">({{ surah.arti }})</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="text-sm text-gray-500 bg-gray-200/50 px-3 py-1 rounded-md">
                    {{ surah.jumlahAyat }} Ayat
                  </div>
                  <div class="w-[1px] bg-gray-500 h-4"></div>
                  <div class="text-sm text-gray-500 bg-gray-200/50 px-3 py-1 rounded-md">{{ surah.tempatTurun }}</div>
                </div>
              </div>
            </div>
            <!-- arab -->
            <div class="text-lg font-bold text-primary">
              <p>{{ surah.nama }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
