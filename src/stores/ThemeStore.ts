import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false);

  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', isDark.value);
  };

  const toggleDark = () => {
    isDark.value = !isDark.value;

    applyTheme();

    localStorage.setItem('theme_quran', isDark.value ? 'dark' : 'light');
  };

  const initTheme = () => {
  const savedTheme = localStorage.getItem('theme_quran');

  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  applyTheme();
  };

  return {
    isDark,
    toggleDark,
    initTheme,
  };
});