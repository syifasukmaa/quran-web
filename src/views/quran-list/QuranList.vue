<script setup>
import { useSurahStore } from '@/stores/surahs';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const surahStore = useSurahStore();
const router = useRouter();
const name = ref('');
const activeTab = ref('surah');
const search = ref('');

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

const filteredSurahs = computed(() => {
  return surahStore.surahs.filter((surah) => surah.namaLatin.toLowerCase().includes(search.value.toLowerCase()));
});
</script>
<template>
  <div>
    <p v-if="surahStore.loading">Loading...</p>

    <div
      v-else
      class="relative"
    >
      <div class="h-[250px] bg-primary rounded-b-[40px] overflow-hidden relative z-0">
        <img
          src="../../assets/alquranwithoutbg.png"
          class="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
        />

        <div class="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60"></div>
      </div>

      <div class="relative -mt-[240px] z-10 px-4 lg:px-28">
        <div class="bg-transparent rounded-t-3xl p-4">
          <div class="flex justify-between items-center mb-6">
            <p class="text-2xl font-bold text-white">Quran App</p>

            <div class="flex items-center gap-3">
              <p class="text-white font-semibold">{{ name }}</p>
              <div class="rounded-full bg-primary/10 px-3 py-2 border border-white text-white font-bold">
                {{ name.slice(0, 2).toUpperCase() }}
              </div>
            </div>
          </div>

          <div class="relative w-full lg:w-1/2 mx-auto mb-4">
            <input
              v-model="search"
              type="text"
              placeholder="Cari surah..."
              class="w-full border border-white rounded-lg px-4 py-2 pr-10"
            />
            <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-white"></i>
          </div>

          <h2 class="text-lg font-bold text-white mb-2">Kategori</h2>
          <div class="flex gap-2 mb-4">
            <button
              @click="activeTab = 'surah'"
              :class="[
                'border rounded-lg px-3 py-2 font-semibold',
                activeTab === 'surah' ? 'bg-yellow-teal text-purple border-yellow-teal' : 'border-primary text-primary',
              ]"
            >
              <i class="pi pi-book"></i> Surah
            </button>

            <button
              @click="activeTab = 'juz'"
              :class="[
                'border rounded-lg px-3 py-2 font-semibold',
                activeTab === 'juz' ? 'bg-yellow-teal text-purple border-yellow-teal' : 'border-white text-white',
              ]"
            >
              <i class="pi pi-file"></i> Juz
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="surah in filteredSurahs"
              :key="surah.nomor"
              @click="goToDetail(surah.nomor)"
              class="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
            >
              <div class="flex justify-between items-center">
                <div class="flex gap-3 items-center">
                  <div
                    class="rounded-full bg-primary/10 px-3 py-1 border border-primary text-primary font-bold flex items-center justify-center"
                  >
                    {{ surah.nomor }}
                  </div>

                  <div>
                    <div class="flex gap-2 items-center">
                      <h1 class="font-semibold">{{ surah.namaLatin }}</h1>
                      <span class="text-sm text-primary">({{ surah.arti }})</span>
                    </div>

                    <div class="flex gap-2 mt-1 text-sm text-gray-500">
                      <span>{{ surah.jumlahAyat }} Ayat</span>
                      <span>|</span>
                      <span>{{ surah.tempatTurun }}</span>
                    </div>
                  </div>
                </div>

                <div class="font-bold text-primary">
                  {{ surah.nama }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
