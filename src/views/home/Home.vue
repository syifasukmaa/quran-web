<template>
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="w-full max-w-md text-center flex flex-col items-center">
            <img src="../../assets/alquran_web.png" alt="alquran" class="w-40 md:w-48 lg:w-56 mb-4" width="192" height="192" />

            <h1 class="font-bold text-3xl md:text-4xl text-primary">My Quran</h1>
            <p class="text-gray-500 text-sm md:text-base mt-2">Baca Al-Qur'an dengan mudah</p>

            <div class="w-full mt-6">
                <input
                    type="text"
                    v-model="name"
                    placeholder="Masukkan nama kamu"
                    class="w-full border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:border-primary"
                    @keyup.enter="navigateToQuranList"
                />

                <p v-if="error" class="text-red-500 text-sm mt-1 text-left">
                    {{ error }}
                </p>
            </div>

            <button @click="navigateToQuranList" class="w-full mt-6 bg-primary text-white font-semibold py-3 rounded-full hover:opacity-90 transition">Baca Sekarang</button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
    const savedName = localStorage.getItem("name");

    if (savedName) {
        router.push("/quran/surah");
    }
});

const navigateToQuranList = () => {
    if (!name.value.trim()) {
        error.value = "Nama tidak boleh kosong";
        return;
    }
    error.value = "";

    localStorage.setItem("name", name.value);
    router.push("/quran/surah");
};

const name = ref("");
const error = ref("");
</script>
<style></style>
