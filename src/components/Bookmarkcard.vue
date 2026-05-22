<script setup>
defineProps({
  item: Object,
});

const emit = defineEmits(['click']);
</script>

<template>
  <div
    class="bg-white dark:bg-muted/10  py-3 rounded-lg border border-gray-300 flex flex-col hover:border-2 hover:-translate-1 ease-in  hover:border-primary cursor-pointer transition-all"
    @click="$emit('click')"
  >

  <div>
     <p
        class="text-center font-bold text-xl line-clamp-1 text-primary "
        dir="rtl"
      >
        {{ item.arabText }}
      </p>
      <p class="font-semibold text-center text-sm dark:text-white">{{ item.surahName }}</p>
      <p class="text-sm text-gray-500 text-center ">Ayat ke {{ item.ayatNumber }}</p>
      <div class="text-center mt-2" >
        <i class=" pi pi-bookmark-fill text-red-500"></i>
      </div>
  </div>
  </div>
</template>
