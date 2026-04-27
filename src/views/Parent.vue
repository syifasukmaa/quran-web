<script setup>
import Headeruser from '@/components/Headeruser.vue';
import Bookmarkcard from '@/components/Bookmarkcard.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const name = ref('');
const search = ref('');
const bookmarks = ref([]);
const goToAyat = (item) => {
  router.push(`/quran/surah/${item.surahId}`);

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

const isActive = (path) => route.path.includes(path);

const baseTab = 'px-3 py-2 rounded-lg font-bold transition-all duration-200 border';

const activeTab = computed(() =>
  hasBookmark.value ? 'bg-primary/20 text-primary border-primary' : 'bg-white text-primary border-white',
);

const inactiveTab = computed(() =>
  hasBookmark.value ? 'text-primary border-primary hover:bg-white/10' : 'text-white border-white hover:bg-white/20',
);

onMounted(() => {
  name.value = localStorage.getItem('name') || '';
  bookmarks.value = JSON.parse(localStorage.getItem('bookmarks') || '[]');
});

const hasBookmark = computed(() => bookmarks.value.length > 0);

const surahList = [
  {
    id: 36,
    name: 'Yasin',
  },
  {
    id: 56,
    name: 'Al Waqiah',
  },
  {
    id: 67,
    name: 'Al Mulk',
  },
  {
    id: 18,
    name: 'Al Kahfi',
  },
  {
    id: 55,
    name: 'Ar Rahman',
  },
  // {
  //   id: 6,
  //   name: 'Ayat Kursi',
  // },
];
</script>

<template>
  <div class="relative">
    <div class="relative h-[250px] rounded-b-[40px] overflow-hidden">
      <div class="absolute inset-0 bg-primary"></div>

      <img
        src="@/assets/alquranwithoutbg.png"
        class="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
      />
    </div>

    <div class="relative -mt-[240px] z-10 px-4 lg:px-28">
      <Headeruser :name="name" />

      <div class="relative w-full lg:w-1/2 mx-auto mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Cari surah..."
          class="w-full border border-white rounded-lg px-4 py-2 pr-10"
        />
        <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-white"></i>
      </div>

      <div class="mt-5 flex items-center justify-center gap-3">
        <div
          class="flex items-center justify-center cursor-pointer"
          @click="router.push(`/quran/surah/${surah.id}`)"
          v-for="surah in surahList"
        >
          <div
            class="bg-white text-primary font-bold py-2 px-4 rounded-full w-fit hover:border-white border hover:bg-transparent hover:text-white transition-all duration-200"
            key=""
          >
            {{ surah.name }}
          </div>
        </div>
      </div>

      <div
        v-if="bookmarks.length"
        class="mt-4"
      >
        <h1 class="text-white font-semibold mb-2 lg:text-lg text-md">Bookmark</h1>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Bookmarkcard
            v-for="item in bookmarks"
            :key="item.ayatNumber"
            :item="item"
            @click="goToAyat(item)"
          />
        </div>
      </div>

      <div class="flex gap-2 mt-6">
        <button
          @click="router.push('/quran/surah')"
          :class="[baseTab, isActive('surah') ? activeTab : inactiveTab]"
        >
          Surah
        </button>

        <button
          @click="router.push('/quran/doa')"
          :class="[baseTab, isActive('doa') ? activeTab : inactiveTab]"
        >
          Doa
        </button>
      </div>

      <div class="mt-6">
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :search="search"
          />
        </router-view>
      </div>
    </div>
  </div>
</template>
