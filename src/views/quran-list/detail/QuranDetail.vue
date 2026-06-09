<script setup>
import { useRoute, useRouter } from "vue-router";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useSurahDetailStore } from "@/stores/surah-detail";
import { useSurahStore } from "@/stores/surahs";
import { useThemeStore } from "@/stores/ThemeStore";

const route = useRoute();
const router = useRouter();

const surahStore = useSurahDetailStore();

const surahStoreList = useSurahStore();

const name = ref("");
const isOpen = ref(false);
const dropdownRef = ref(null);
const isOpenAyat = ref(false);
const dropdownRefAyat = ref(null);
const bookmarks = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");
const themeStore = useThemeStore();
const currentAyat = ref(null);
const currentAudio = ref(null);
const isPlaying = ref(false);

const handleClickOutsideAll = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        isOpen.value = false;
    }
    if (dropdownRefAyat.value && !dropdownRefAyat.value.contains(e.target)) {
        isOpenAyat.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutsideAll);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutsideAll);
});
onMounted(async () => {
    try {
        isLoading.value = true;
        errorMessage.value = "";

        name.value = localStorage.getItem("name");

        await surahStore.fetchSurahs(Number(route.params.id));

        await surahStoreList.fetchSurahs();
    } catch (error) {
        errorMessage.value = "Gagal memuat data surah";
        console.error(error);
    } finally {
        isLoading.value = false;
    }
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
            behavior: "smooth",
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

const playAudio = async (url, ayatNumber) => {
    try {
        audio.pause();
        audio.currentTime = 0;

        audio.src = url;

        await audio.play();

        currentAudio.value = url;
        currentAyat.value = ayatNumber;
        isPlaying.value = true;
    } catch (error) {
        console.error(error);
        alert("Audio gagal diputar");
    }
};
const stopAudio = () => {
    audio.pause();
    audio.currentTime = 0;

    currentAudio.value = null;
    currentAyat.value = null;
    isPlaying.value = false;
};

const pauseAudio = () => {
    audio.pause();
    isPlaying.value = false;
};

const resumeAudio = async () => {
    try {
        await audio.play();
        isPlaying.value = true;
    } catch (error) {
        console.error(error);
    }
};
onMounted(() => {
    audio.addEventListener("ended", () => {
        currentAudio.value = null;
        isPlaying.value = false;
    });

    window.addEventListener("beforeunload", stopAudio);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAudio();
        }
    });
});

onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", stopAudio);
});

// ini untuk bookmark
onMounted(() => {
    bookmarks.value = JSON.parse(localStorage.getItem("bookmarks") || "[]");
});

const toggleBookmark = (ayat) => {
    const isExist = bookmarks.value.find(
        (item) => item.surahId === Number(route.params.id) && item.ayatNumber === ayat.nomorAyat,
    );

    if (isExist) {
        bookmarks.value = bookmarks.value.filter(
            (item) =>
                !(item.surahId === Number(route.params.id) && item.ayatNumber === ayat.nomorAyat),
        );
    } else {
        bookmarks.value.push({
            surahId: Number(route.params.id),
            ayatNumber: ayat.nomorAyat,
            surahName: surahStore.surahDetail.namaLatin,
            arabText: surahStore.surahDetail.nama,
            // arabText: ayat.teksArab,
        });
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks.value));
};

const isBookmarked = (ayat) => {
    return bookmarks.value.some(
        (item) => item.surahId === Number(route.params.id) && item.ayatNumber === ayat.nomorAyat,
    );
};

const shareToWhatsapp = (ayat) => {
    const text = `${surahStore.surahDetail.namaLatin} - Ayat ${ayat.nomorAyat} ${ayat.teksArab} ${ayat.teksIndonesia} ${window.location.href}#ayat-${ayat.nomorAyat}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
};
</script>

<template>
    <div v-if="errorMessage" class="flex flex-col items-center justify-center py-20 text-center">
        <i class="pi pi-exclamation-circle text-red-500 text-5xl mb-4"></i>

        <h1 class="text-xl font-bold text-red-500">Terjadi Kesalahan</h1>

        <p class="text-gray-500 mt-2">
            {{ errorMessage }}
        </p>

        <button
            @click="router.go(0)"
            class="mt-5 bg-primary text-white px-5 py-2 rounded-xl cursor-pointer"
        >
            Coba Lagi
        </button>
    </div>

    <div v-else class="relative">
        <div class="h-[80px] bg-primary w-full overflow-hidden relative z-0">
            <img
                src="../../../assets/alquranwithoutbg.png"
                class="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
                alt="alquran without background"
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
                        <div
                            class="rounded-full bg-primary/10 px-3 py-2.5 border border-white text-white font-bold"
                        >
                            {{ name.slice(0, 2).toUpperCase() }}
                        </div>
                        <button
                            @click="themeStore.toggleDark"
                            aria-label="button dark mode"
                            class="cursor-pointer inline-flex items-center gap-2 p-4 rounded-full text-lg font-semibold bg-white text-gray-600 dark:text-white dark:bg-muted transition-all duration-200"
                        >
                            <i
                                :class="
                                    themeStore.isDark ? 'pi pi-moon text-lg' : 'pi pi-sun text-lg'
                                "
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="-mt-5">
            <div class="flex items-center flex-col">
                <div
                    class="bg-gray-400/20 w-full text-center flex flex-col items-center justify-start lg:justify-center py-8"
                >
                    <h1 class="text-2xl font-bold dark:text-primary">
                        {{ surahStore.surahDetail.nama }}
                    </h1>
                    <div class="flex gap-2 items-center mt-1">
                        <p class="font-semibold dark:text-white">
                            {{ surahStore?.surahDetail?.namaLatin }}
                        </p>
                        <p class="text-sm dark:text-primary">({{ surahStore.surahDetail.arti }})</p>
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
                        <div ref="dropdownRef" class="relative inline-block w-full lg:w-fit">
                            <button
                                @click="isOpen = !isOpen"
                                class="border border-gray-400/40 hover:bg-gray-100 hover:text-primary text-black px-4 py-2 rounded-lg flex items-center justify-between gap-2 w-full cursor-pointer dark:bg-muted dark:border-white dark:text-white"
                            >
                                Surah
                                <i class="pi pi-chevron-down text-gray-400 dark:text-white"></i>
                            </button>

                            <div
                                v-if="isOpen"
                                class="absolute mt-2 w-40 cursor-pointer bg-white border rounded-lg shadow-lg z-50 h-48 overflow-y-auto hover:bg-gray-100 hover:text-primary dark:bg-muted dark:border-white dark:text-white"
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
                        <div ref="dropdownRefAyat" class="relative inline-block w-full lg:w-fit">
                            <button
                                @click="isOpenAyat = !isOpenAyat"
                                class="border border-gray-400/40 hover:bg-gray-100 hover:text-primary text-black px-4 py-2 rounded-lg flex items-center justify-between gap-2 w-full cursor-pointer dark:bg-muted dark:border-white dark:text-white"
                            >
                                Ayat
                                <i class="pi pi-chevron-down text-gray-400 dark:text-white"></i>
                            </button>

                            <div
                                v-if="isOpenAyat"
                                class="absolute mt-2 w-40 cursor-pointer bg-white border rounded-lg shadow-lg z-50 h-48 overflow-auto hover:bg-gray-100 hover:text-primary dark:bg-muted dark:border-white dark:text-white"
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
                    <h1 class="text-center font-semibold my-8 text-2xl dark:text-primary">
                        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </h1>
                    <div
                        v-for="ayat in surahStore.surahDetail.ayat"
                        :key="ayat.ayat"
                        class="py-2"
                        :id="`ayat-${ayat.nomorAyat}`"
                    >
                        <p class="text-right text-2xl font-semibold dark:text-primary">
                            {{ ayat.teksArab }}
                        </p>
                        <p class="text-left text-primary font-semibold mt-5 text-lg">
                            {{ ayat.teksLatin }}
                        </p>
                        <p class="text-left mt-3 text-lg dark:text-white">
                            {{ ayat?.nomorAyat }}. {{ ayat.teksIndonesia }}
                        </p>

                        <div class="flex items-center gap-3 mt-4">
                            <i
                                class="pi pi-play-circle text-primary text-3xl cursor-pointer"
                                @click="playAudio(ayat.audio?.['01'], ayat.nomorAyat)"
                            ></i>
                            <i
                                class="pi pi-share-alt text-primary text-2xl cursor-pointer"
                                @click="shareToWhatsapp(ayat)"
                            ></i>
                            <i
                                class="pi text-2xl cursor-pointer"
                                :class="
                                    isBookmarked(ayat)
                                        ? 'pi-bookmark-fill text-yellow-500'
                                        : 'pi-bookmark text-primary'
                                "
                                @click="toggleBookmark(ayat)"
                            ></i>
                        </div>
                        <div class="w-full h-[1px] bg-gray-400 my-4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Transition
        enter-active-class="transition duration-300"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-300"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
    >
        <div
            class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-white/80 shadow-xl rounded-2xl p-4 z-[999] border border-gray-300x md:w-1/3 w-90 dark:border-white dark:backdropbackdrop-blur-2xl"
            v-if="currentAudio"
        >
            <div class="flex flex-col items-center justify-between">
                <div>
                    <p class="font-semibold dark:text-black">Sedang Memutar Audio</p>

                    <div class="flex items-center justify-center gap-2">
                        <p class="text-sm text-gray-500 dark:text-black">
                            {{ surahStore.surahDetail.namaLatin }}
                        </p>
                        <span class="text-gray-500 dark:text-black">-</span>
                        <p class="text-sm text-gray-500 dark:text-black">Ayat {{ currentAyat }}</p>
                    </div>
                </div>

                <div class="flex items-center gap-3 mt-4">
                    <button
                        v-if="isPlaying"
                        @click="pauseAudio"
                        class="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center cursor-pointer"
                    >
                        <i class="pi pi-pause"></i>
                    </button>

                    <button
                        v-else
                        @click="resumeAudio"
                        class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"
                    >
                        <i class="pi pi-play"></i>
                    </button>

                    <button
                        @click="stopAudio"
                        class="w-10 h-10 rounded-full bg-red-800 text-white flex items-center justify-center cursor-pointer"
                    >
                        <i class="pi pi-stop"></i>
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
