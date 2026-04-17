<script setup>
defineProps({
  modelValue: String,
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full lg:w-1/2 mx-auto mb-4">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      placeholder="Cari surah..."
      class="w-full bg-white/90 backdrop-blur border border-transparent rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
    />
    <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-white"></i>
  </div>
</template>
