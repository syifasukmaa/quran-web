h1
<script setup>
import Bookmarkcard from '@/components/Bookmarkcard.vue';
import Headeruser from '@/components/Headeruser.vue';
import Loading from '@/components/Loading.vue';
import Surahcard from '@/components/Surahcard.vue';
import { useSurahStore } from '@/stores/surahs';
import { computed, onActivated, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const surahStore = useSurahStore();
const router = useRouter();
const name = ref('');
const activeTab = ref('surah');
const search = ref('');
const bookmarks = ref([]);

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

// ini untuk mengambil data bookmark
onMounted(() => {
  bookmarks.value = JSON.parse(localStorage.getItem('bookmarks') || '[]');
});
const goToAyat = (item) => {
  router.push(`/list-quran/${item.surahId}`);

  setTimeout(() => {
    const el = document.getElementById(`ayat-${item.ayatNumber}`);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, 500);
};

onActivated(() => {
  bookmarks.value = JSON.parse(localStorage.getItem('bookmarks') || '[]');
});

onMounted(() => {
  const loadBookmarks = () => {
    bookmarks.value = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  };

  loadBookmarks();

  window.addEventListener('bookmark-updated', loadBookmarks);
});

const displayedData = computed(() => {
  if (activeTab.value === 'surah') {
    return surahStore.surahs.filter((surah) => surah.namaLatin.toLowerCase().includes(search.value.toLowerCase()));
  }

  if (activeTab.value === 'doa') {
    return [];
  }
});
</script>
<template>
  <div class="relative">
    <div class="h-[250px] bg-primary rounded-b-[40px] overflow-hidden relative z-0">
      <img
        src="../../assets/alquranwithoutbg.png"
        class="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60"></div>
    </div>

    <div class="relative -mt-[240px] z-10 px-4 lg:px-28">
      <div class="bg-transparent rounded-t-3xl p-4">
        <Headeruser :name="name" />

        <div class="relative w-full lg:w-1/2 mx-auto mb-4">
          <input
            v-model="search"
            type="text"
            placeholder="Cari surah..."
            class="w-full border border-white rounded-lg px-4 py-2 pr-10"
          />
        </div>

        <div v-if="bookmarks.length >= 1">
          <h1 class="font-semibold text-white mt-10 mb-3">Bookmark</h1>

          <div class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
            <Bookmarkcard
              v-for="item in bookmarks"
              :key="item.ayatNumber"
              :item="item"
              @click="goToAyat(item)"
            />
          </div>
        </div>

        <!-- TAB -->
        <div class="flex gap-2 mb-4 mt-6">
          <button
            @click="activeTab = 'surah'"
            :class="[
              'border px-3 py-2 rounded-lg cursor-pointer',
              activeTab === 'surah'
                ? 'bg-white text-primary hover:bg-primary hover:text-white'
                : 'text-primary border-primary hover:bg-primary hover:text-white',
            ]"
          >
            Surah
          </button>

          <button
            @click="activeTab = 'doa'"
            :class="[
              'border px-3 py-2 rounded-lg cursor-pointer',
              activeTab === 'doa'
                ? 'bg-white text-primary'
                : 'text-primary border-primary hover:bg-primary hover:text-white',
            ]"
          >
            Doa
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <!-- loading -->
          <Loading
            v-if="surahStore.loading"
            v-for="n in 6"
            :key="n"
          />

          <Surahcard
            v-else-if="activeTab === 'surah'"
            v-for="surah in displayedData"
            :key="surah.nomor"
            :surah="surah"
            @click="goToDetail(surah.nomor)"
          />

          <div
            v-else-if="activeTab === 'doa'"
            class="text-white"
          >
            Fitur doa belum tersedia
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
