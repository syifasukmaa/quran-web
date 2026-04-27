<script setup>
import { useDoaDetailStore } from '@/stores/doa-detail';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const doaStore = useDoaDetailStore();

const name = ref('');
console.log(doaStore.doaDetail);

onMounted(async () => {
  await doaStore.fetchDoas(Number(route.params.id));
  name.value = localStorage.getItem('name');
});
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
            @click="router.push('/quran/doa')"
            class="flex items-center gap-2 cursor-pointer"
          >
            <i class="pi pi-arrow-left text-white text-lg cursor-pointer"></i>
            <p class="text-white font-semibold text-base">Daftar Doa</p>
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
  </div>

  <div class="px-4 lg:px-28 mt-15">
    <div class="rounded-2xl w-full h-[180px] relative overflow-hidden">
      <img
        src="../../../assets/sunandcloud.jpg"
        alt=""
        class="h-full w-full object-cover"
      />
      <div class="h-full absolute inset-0 bg-primary/50"></div>

      <div class="absolute bottom-4 lg:bottom-8 lg:left-10 left-5 flex items-center flex-col">
        <h1 class="text-xs lg:text-shadow-md text-white mb-2 bg-white/20 px-4 py-1 rounded-full">
          {{ doaStore.doaDetail.grup }}
        </h1>
        <h2 class="text-lg lg:text-3xl font-semibold text-white">{{ doaStore.doaDetail.nama }}</h2>
      </div>
    </div>

    <div class="bg-white drop-shadow-lg drop-shadow-gray-400/20 rounded-2xl px-5 py-4 mt-6 mb-6">
      <h3 class="text-right text-2xl mb-5 font-semibold">{{ doaStore.doaDetail.ar }}</h3>

      <div class="border-l-4 border-l-primary rounded-2xl px-3 py-5">
        <h4 class="text-primary font-medium uppercase text-xs">Transliterasi</h4>
        <p class="text-gray-700 mt-2">{{ doaStore.doaDetail.tr }}</p>
      </div>

      <div class="px-3 py-5 mt-4">
        <h4 class="text-gray-500 font-medium uppercase text-xs">Terjemahan</h4>
        <p class="text-gray-700 mt-2">{{ doaStore.doaDetail.idn }}</p>
      </div>
      <div class="bg-gray-300 h-[1px] my-2"></div>

      <div class="mt-10 lg:mt-15 mb-10">
        <span class="flex items-center gap-3 lg:px-8 px-4">
          <i class="pi pi-bookmark"></i>
          <p class="font-medium">Keterangan & Sanad</p>
        </span>

        <div class="lg:px-15 px-4 mt-3 mb-3">
          {{ doaStore.doaDetail.tentang }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <span
          class="bg-gray-200 px-3 py-1 rounded-full capitalize text-black text-xs font-semibold"
          v-for="doa in doaStore.doaDetail.tag"
        >
          #{{ doa }}
        </span>
      </div>
    </div>
  </div>
</template>
