<script setup>
import { useThemeStore } from '@/stores/ThemeStore';
import { onMounted, ref } from 'vue';

defineProps({
  name: String,
  showBack: Boolean,
});

const surah = ref([]);
const themeStore = useThemeStore()

onMounted(() => {
  surah.value = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  themeStore.initTheme();
});

</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <div
      v-if="showBack"
      class="flex items-center gap-2 cursor-pointer"
    >
      <i class="pi pi-arrow-left"></i>
      <slot name="backText">Kembali</slot>
    </div>

    <p class="text-white dark:text-primary font-semibold text-xl lg:text-2xl">Quran App</p>

    <div class="flex items-center justify-between gap-3">
      <div class="text-right" >
        <p class="text-white dark:text-white font-semibold">{{ name }}</p>
       <p class="text-white/80 text-sm "> {{ surah.length}} surah dibaca</p>
      </div>
      <div class="rounded-full bg-primary/10 px-3 py-2.5 border-2 border-gray-300 text-white font-bold">

       <p>   
         {{ name?.slice(0, 2).toUpperCase() }}
      </p>
    </div>
      <button @click="themeStore.toggleDark" class=" cursor-pointer inline-flex items-center gap-2 p-4 rounded-full text-lg  font-semibold bg-white text-gray-600 dark:text-white dark:bg-muted transition-all duration-200">
        <i :class="themeStore.isDark ? 'pi pi-moon text-lg' : 'pi pi-sun text-lg'" />
      </button>
  </div>
  </div>
</template>
