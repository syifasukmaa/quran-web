import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import animate from './directives/animate';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
app.directive('animate', animate);
