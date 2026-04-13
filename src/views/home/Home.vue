<template>
  <div class="flex flex-col items-center justify-center h-screen py-20">
    <img
      src="../../assets/alquran_web.png"
      alt="alquran"
      class="lg:w-[15%] w-[50%] md:w-[35%]"
    />
    <div class="text-center mb-2 -mt-5">
      <h1 class="font-bold text-3xl lg:text-4xl text-primary">My Quran</h1>
      <p class="text-base text-gray-500 w-full lg:text-lg mt-2">Baca Alquran dengan mudah</p>
    </div>
    <input
      type="text"
      v-model="name"
      placeholder="Isikan nama kamu"
      class="border border-gray-300 rounded-full px-4 py-2 mt-4 focus:outline-none focus:border-primary"
    />
    <p
      v-if="error"
      class="text-red-500 text-sm mt-1"
    >
      {{ error }}
    </p>
    <button
      class="mt-auto rounded-full bg-primary py-2.5 px-8 lg:px-6 text-white font-semibold cursor-pointer"
      @click="navigateToQuranList"
      @keyup.enter="navigateToQuranList"
    >
      Baca Sekarang
    </button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToQuranList = () => {
  if (!name.value.trim()) {
    error.value = 'Nama tidak boleh kosong';
    return;
  }
  error.value = '';

  localStorage.setItem('name', name.value);
  router.push('/list-quran');
};

const name = ref('');
const error = ref('');
</script>
<style></style>
