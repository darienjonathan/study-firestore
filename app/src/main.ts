import { createApp } from 'vue';
import './style.css';
import BaseApp from './BaseApp.vue';
import firebasePlugin from './plugins/firebase';

const app = createApp(BaseApp).use(firebasePlugin);

app.mount('#app');
