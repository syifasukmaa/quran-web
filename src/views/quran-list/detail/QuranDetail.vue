<script setup>
import { useRoute, useRouter } from 'vue-router';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSurahDetailStore } from '@/stores/surah-detail';
import { useSurahStore } from '@/stores/surahs';

const route = useRoute();
const router = useRouter();

const surahStore = useSurahDetailStore();

const surahStoreList = useSurahStore();

const name = ref('');
const isOpen = ref(false);
const dropdownRef = ref(null);
const isOpenAyat = ref(false);
const dropdownRefAyat = ref(null);
const bookmarks = ref([]);

// const handleClickOutside = (e) => {
//   if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
//     isOpen.value = false;
//   }
// };

// onMounted(() => {
//   document.addEventListener('click', handleClickOutside);
// });

// onBeforeUnmount(() => {
//   document.removeEventListener('click', handleClickOutside);
// });
// const handleClickOutsideAyat = (e) => {
//   if (dropdownRefAyat.value && !dropdownRefAyat.value.contains(e.target)) {
//     isOpenAyat.value = false;
//   }
// };

// onMounted(() => {
//   document.addEventListener('click', handleClickOutsideAyat);
// });

// onBeforeUnmount(() => {
//   document.removeEventListener('click', handleClickOutsideAyat);
// });

const handleClickOutsideAll = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
  if (dropdownRefAyat.value && !dropdownRefAyat.value.contains(e.target)) {
    isOpenAyat.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideAll);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideAll);
});
onMounted(async () => {
  name.value = localStorage.getItem('name');
  await surahStore.fetchSurahs(Number(route.params.id));

  surahStoreList.fetchSurahs();
  // console.log('List:', surahStoreList.surahs);
});

const selectSurah = (id) => {
  isOpen.value = false;
  router.push(`/quran/surah/${id}`);
};

const scrollToAyat = async (nomor) => {
  isOpenAyat.value = false;

  await nextTick();

  const el = document.getElementById(`ayat-${nomor}`);
  if (el) {
    const yOffset = -100;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await surahStore.fetchSurahs(Number(newId));
    }
  },
);

const audio = new Audio();

const playAudio = (url) => {
  audio.pause();
  audio.currentTime = 0;

  audio.src = url;
  audio.play();
};

const stopAudio = () => {
  audio.pause();
  audio.currentTime = 0;
};

onMounted(() => {
  window.addEventListener('beforeunload', stopAudio);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAudio();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', stopAudio);
});

// ini untuk bookmark
onMounted(() => {
  bookmarks.value = JSON.parse(localStorage.getItem('bookmarks') || '[]');
});

const toggleBookmark = (ayat) => {
  const isExist = bookmarks.value.find(
    (item) => item.surahId === Number(route.params.id) && item.ayatNumber === ayat.nomorAyat,
  );

  if (isExist) {
    bookmarks.value = bookmarks.value.filter(
      (item) => !(item.surahId === Number(route.params.id) && item.ayatNumber === ayat.nomorAyat),
    );
  } else {
    bookmarks.value.push({
      surahId: Number(route.params.id),
      ayatNumber: ayat.nomorAyat,
      surahName: surahStore.surahDetail.namaLatin,
      arabText: ayat.teksArab,
    });
  }

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
};

const isBookmarked = (ayat) => {
  return bookmarks.value.some((item) => item.surahId === Number(route.params.id) && item.ayatNumber === ayat.nomorAyat);
};
</script>

<template>
  <div class="relative">
    <div class="h-[80px] bg-primary w-full overflow-hidden relative z-0">
      <img
        src="../../../assets/alquranwithoutbg.png"
        class="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
      />

      <div class="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60"></div>
    </div>

    <div class="relative -mt-[75px] z-10 px-4 lg:px-28">
      <div class="bg-transparent rounded-t-3xl px-4 pt-4">
        <div class="flex justify-between items-center mb-6">
          <div
            @click="router.push('/quran/surah')"
            class="flex items-center gap-2 cursor-pointer"
          >
            <i class="pi pi-arrow-left text-white text-lg cursor-pointer"></i>
            <p class="text-white font-semibold text-base">Daftar Surah</p>
          </div>

          <div class="flex items-center gap-3">
            <p class="text-white font-semibold">{{ name }}</p>
            <div class="rounded-full bg-primary/10 px-3 py-2 border border-white text-white font-bold">
              {{ name.slice(0, 2).toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="-mt-5">
      <div class="flex items-center flex-col">
        <div class="bg-gray-400/20 w-full text-center flex flex-col items-center justify-start lg:justify-center py-8">
          <h1 class="text-2xl font-bold">{{ surahStore.surahDetail.nama }}</h1>
          <div class="flex gap-2 items-center mt-1">
            <p class="font-semibold">{{ surahStore?.surahDetail?.namaLatin }}</p>
            <p class="text-sm">({{ surahStore.surahDetail.arti }})</p>
          </div>

          <div class="flex gap-2 items-center mt-2">
            <p class="border border-gray-500 px-3 py-1 rounded-lg text-gray-400">
              <i class="pi pi-book"></i> {{ surahStore.surahDetail.jumlahAyat }} Ayat
            </p>
            <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
            <p class="border border-gray-500 px-3 py-1 rounded-lg text-gray-400">
              <i class="pi pi-file"></i>
              {{ surahStore.surahDetail.tempatTurun }}
            </p>
          </div>

          <div class="mt-4 flex gap-2 justify-start w-full px-10 lg:justify-center">
            <div
              ref="dropdownRef"
              class="relative inline-block w-full lg:w-fit"
            >
              <button
                @click="isOpen = !isOpen"
                class="border border-gray-400/40 text-black px-4 py-2 rounded-lg flex items-center justify-between gap-2 w-full cursor-pointer"
              >
                Surah <i class="pi pi-chevron-down text-gray-400"></i>
              </button>

              <div
                v-if="isOpen"
                class="absolute mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 h-48 overflow-y-auto"
              >
                <ul class="py-2">
                  <li
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
                    v-for="namaSurah in surahStoreList?.surahs"
                    :key="namaSurah.nomor"
                    @click="selectSurah(namaSurah.nomor)"
                  >
                    {{ namaSurah.namaLatin }}
                  </li>
                </ul>
              </div>
            </div>
            <div
              ref="dropdownRefAyat"
              class="relative inline-block w-full lg:w-fit"
            >
              <button
                @click="isOpenAyat = !isOpenAyat"
                class="border border-gray-400/40 text-black px-4 py-2 rounded-lg flex items-center justify-between gap-2 w-full cursor-pointer"
              >
                Ayat <i class="pi pi-chevron-down text-gray-400"></i>
              </button>

              <div
                v-if="isOpenAyat"
                class="absolute mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 h-48 overflow-auto"
              >
                <div
                  v-for="ayat in surahStore.surahDetail.ayat"
                  :key="ayat.nomorAyat"
                  @click="scrollToAyat(ayat.nomorAyat)"
                  class="py-2"
                >
                  {{ ayat.nomorAyat }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 md:pr-8 md:pl-12 lg:px-28">
          <h1 class="text-center font-semibold my-8 text-2xl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
          <div
            v-for="ayat in surahStore.surahDetail.ayat"
            :key="ayat.ayat"
            class="py-2"
            :id="`ayat-${ayat.nomorAyat}`"
          >
            <p class="text-right text-2xl font-semibold">
              {{ ayat.teksArab }}
              <span class="rounded-full border border-primary px-2 py-1 text-xs">{{ ayat?.nomorAyat }}</span>
            </p>
            <p class="text-left text-primary font-semibold mt-5 text-lg">{{ ayat.teksLatin }}</p>
            <p class="text-left mt-3 text-lg">{{ ayat?.nomorAyat }}. {{ ayat.teksIndonesia }}</p>

            <div class="flex items-center gap-3 mt-4">
              <i
                class="pi pi-play-circle text-primary text-3xl cursor-pointer"
                @click="playAudio(ayat.audio?.['01'])"
              ></i>
              <i class="pi pi-share-alt text-primary text-2xl cursor-pointer"></i>
              <i
                class="pi text-2xl cursor-pointer"
                :class="isBookmarked(ayat) ? 'pi-bookmark-fill text-yellow-500' : 'pi-bookmark text-primary'"
                @click="toggleBookmark(ayat)"
              ></i>
            </div>
            <div class="w-full h-[1px] bg-gray-400 my-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
