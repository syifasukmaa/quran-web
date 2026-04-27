<script setup>
import { useDoaStore } from '@/stores/doas';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  search: String,
});

const router = useRouter();
const doaStore = useDoaStore();

onMounted(() => {
  doaStore.fetchDoas();
});

const displayDataDoa = computed(() => {
  return doaStore.doas.filter((doa) => doa.nama.toLowerCase().includes((props.search || '').toLowerCase()));
});
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <div
      v-for="doa in displayDataDoa"
      :key="doa.id"
      @click="router.push(`/quran/doa/${doa.id}`)"
      class="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition flex justify-between gap-4 cursor-pointer"
    >
      <div class="flex flex-col flex-1">
        <div class="flex gap-3 items-center">
          <div class="rounded-full bg-primary/10 px-3 py-1 border border-primary text-primary font-bold text-sm">
            {{ doa.id.toString().padStart(2, '0') }}
          </div>
          <p class="text-primary bg-primary/10 px-2 py-1 rounded-lg font-semibold text-xs">{{ doa.grup }}</p>
        </div>

        <h1 class="font-semibold text-black mt-3">{{ doa.nama }}</h1>
        <p class="text-gray-500 text-sm line-clamp-2 mt-2">{{ doa.idn }}</p>
      </div>

      <div class="w-[120px] bg-primary/5 border border-primary p-3 rounded-xl flex items-center justify-center">
        <p
          class="text-black font-semibold text-sm text-center line-clamp-2"
          dir="rtl"
        >
          {{ doa.ar }}
        </p>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped>
.badge {
  @apply rounded-full bg-primary/10 px-3 py-1 border border-primary text-primary font-bold text-sm;
}
.tag {
  @apply text-primary bg-primary/10 px-2 py-1 rounded-lg font-semibold text-xs;
}
.title {
  @apply font-semibold text-black mt-3;
}
.desc {
  @apply text-gray-500 text-sm line-clamp-2 mt-2;
}
.arab-box {
  @apply w-[120px] bg-gray-50 border p-3 rounded-xl flex items-center justify-center;
}
.arab {
  @apply text-black font-semibold text-sm text-center line-clamp-2;
  direction: rtl;
}
</style> -->
